'use client';

import React, { useState } from 'react';
import styles from './TaskModal.module.css';
import { updateTaskAction } from '@/app/actions/tasks';
import { useToast } from '@/components/Toast/ToastContext';

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default function TaskModal({ task, onClose, onSave, allUsers = [] }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [status, setStatus] = useState(task.status || 'TODO');
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || '');

  const { addToast } = useToast();

  // Simuler si la modale a des changements
  const hasChanges = title !== (task.title || '') ||
                     description !== (task.description || '') ||
                     status !== (task.status || 'TODO') ||
                     dueDate !== (task.dueDate ? task.dueDate.split('T')[0] : '') ||
                     assigneeId !== (task.assigneeId || '');

  const handleSave = async () => {
    if (!hasChanges) return;
    const payload = {
      title,
      description,
      status,
      dueDate,
      assigneeId,
    };
    try {
      const result = await updateTaskAction(task.project?.id || '', task.id, payload);
      if (result?.error) {
        addToast(result.error, 'error');
      } else {
        addToast('Tâche mise à jour avec succès', 'success');
        onSave({ ...task, ...payload });
      }
    } catch (e) {
      addToast('Erreur lors de la mise à jour', 'error');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className={styles.title}>Modifier</h2>

        <div className={styles.field}>
          <label className={styles.label}>Titre</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la tâche"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Échéance</label>
          <div className={styles.inputField}>
            <input
              type="date"
              className={styles.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {/* Si c'était un input standard text avec icône, mais input type="date" a souvent sa propre icône. 
                On laisse la possibilité d'utiliser l'icône de calendrier à droite si on masque celle par défaut. */}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Assigné à :</label>
          <div className={styles.inputField}>
            <select
              className={styles.select}
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              <option value="">Sélectionner un collaborateur</option>
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            <div className={styles.selectIcon}>
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Statut :</label>
          <div className={styles.statusContainer}>
            <button
              className={`${styles.statusBtn} ${styles.statusTODO} ${status === 'TODO' ? styles.activeStatus : styles.inactiveStatus}`}
              onClick={() => setStatus('TODO')}
            >
              À faire
            </button>
            <button
              className={`${styles.statusBtn} ${styles.statusIN_PROGRESS} ${status === 'IN_PROGRESS' ? styles.activeStatus : styles.inactiveStatus}`}
              onClick={() => setStatus('IN_PROGRESS')}
            >
              En cours
            </button>
            <button
              className={`${styles.statusBtn} ${styles.statusDONE} ${status === 'DONE' ? styles.activeStatus : styles.inactiveStatus}`}
              onClick={() => setStatus('DONE')}
            >
              Terminée
            </button>
          </div>
        </div>

        <button
          className={`${styles.saveBtn} ${hasChanges ? styles.saveBtnActive : ''}`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
