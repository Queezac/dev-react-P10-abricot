'use client';

import React, { useState } from 'react';
import styles from './AiTaskModal.module.css';

export default function AiTaskModal({
  isOpen,
  onClose,
  onGenerate,
  onSave,
  existingTasks = [],
  onDeleteExisting,
  onUpdateExisting
}) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [generatedTasks, setGeneratedTasks] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const newTasks = await onGenerate(prompt);
      setGeneratedTasks((prev) => [...prev, ...newTasks]);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la génération.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTasks = async () => {
    if (generatedTasks.length === 0 || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      await onSave(generatedTasks);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (id, title, desc) => {
    setEditingId(id);
    setEditTitle(title);
    setEditDesc(desc || '');
  };

  const saveEdit = async (id, isExisting) => {
    if (isExisting) {
      await onUpdateExisting(id, { title: editTitle, description: editDesc });
    } else {
      setGeneratedTasks((prev) => {
        const updated = [...prev];
        updated[id] = { ...updated[id], title: editTitle, description: editDesc };
        return updated;
      });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleRemove = async (id, isExisting) => {
    if (isExisting) {
      await onDeleteExisting(id);
    } else {
      setGeneratedTasks((prev) => prev.filter((_, i) => i !== id));
      if (editingId === `gen-${id}`) setEditingId(null);
    }
  };

  const allTasks = [
    ...existingTasks.map(t => ({ ...t, isExisting: true })),
    ...generatedTasks.map((t, i) => ({ ...t, isExisting: false, localIndex: i }))
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} disabled={isLoading || isSaving}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <img src="/img/icons/ia.svg" alt="IA" className={styles.sparkleIcon} width={24} height={24} />
          <h2 className={styles.title}>
            {allTasks.length > 0 ? "Vos tâches..." : "Créer une tâche"}
          </h2>
        </div>

        <div className={styles.content}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {allTasks.length > 0 && (
            <div className={styles.tasksList}>
              {allTasks.map((t) => {
                const uniqueId = t.isExisting ? `ext-${t.id}` : `gen-${t.localIndex}`;
                const isEditing = editingId === uniqueId;

                return (
                  <div className={styles.taskItem} key={uniqueId}>
                    {isEditing ? (
                      <div className={styles.editingForm}>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Nom de la tâche"
                        />
                        <textarea
                          className={styles.editTextarea}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Description de la tâche"
                        />
                        <div className={styles.editActions}>
                          <button className={styles.cancelEditBtn} onClick={cancelEdit}>Annuler</button>
                          <button className={styles.saveEditBtn} onClick={() => saveEdit(t.isExisting ? t.id : t.localIndex, t.isExisting)}>Enregistrer</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className={styles.taskTitle}>{t.title}</h3>
                        <p className={styles.taskDesc}>{t.description}</p>
                        <div className={styles.taskActions}>
                          <button className={styles.actionBtn} onClick={() => handleRemove(t.isExisting ? t.id : t.localIndex, t.isExisting)}>
                            <img src="/img/icons/delete.svg" alt="Supprimer" width={14} height={14} />
                            Supprimer
                          </button>
                          <span className={styles.divider}>|</span>
                          <button className={styles.actionBtn} onClick={() => startEdit(uniqueId, t.title, t.description)}>
                            <img src="/img/icons/update.svg" alt="Modifier" width={14} height={14} />
                            Modifier
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {generatedTasks.length > 0 && (
                <div className={styles.saveContainer}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSaveTasks}
                    disabled={isSaving}
                  >
                    {isSaving ? "Ajout en cours..." : "+ Ajouter les tâches"}
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>L'IA réfléchit et crée vos tâches...</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <form className={styles.inputForm} onSubmit={handleGenerate}>
            <input
              type="text"
              className={styles.input}
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading || isSaving}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!prompt.trim() || isLoading || isSaving}
            >
              <img src="/img/icons/ia.svg" alt="Ajouter" width={14} height={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
