'use client';

import React, { useState } from 'react';
import styles from './ProjectModal.module.css';

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function ProjectModal({ project, onClose, onSave, allUsers = [] }) {
  const isEditing = !!project;
  const [title, setTitle] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [selectedMembers, setSelectedMembers] = useState(
    project?.members ? project.members.map(m => m.user?.id || m.userId || m.id || m) : []
  );

  const titleText = isEditing ? 'Modifier un projet' : 'Créer un projet';
  const buttonText = isEditing ? 'Enregistrer' : 'Ajouter un projet';

  // Basic diff check for edit mode
  const initialMembers = project?.members ? project.members.map(m => m.user?.id || m.userId || m.id || m) : [];
  const hasChanges = title !== (project?.name || '') ||
    description !== (project?.description || '') ||
    JSON.stringify(selectedMembers.sort()) !== JSON.stringify(initialMembers.sort());

  const handleSave = () => {
    if (!title || !description) return;
    const payload = {
      name: title,
      description,
      members: selectedMembers,
    };
    if (onSave) {
      onSave(payload);
    }
  };

  const getDisplayName = (memberId) => {
    const user = allUsers.find(u => u.id === memberId);
    if (user) return user.name || user.email;

    if (project && project.members) {
      const initialMember = project.members.find(m => (m.user?.id === memberId || m.userId === memberId || m.id === memberId));
      if (initialMember && initialMember.user) {
        return initialMember.user.name || initialMember.user.email;
      }
    }
    return typeof memberId === 'string' ? memberId : "ID inconnu";
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

        <h2 className={styles.title}>{titleText}</h2>

        <div className={styles.field}>
          <label className={styles.label}>Titre*</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isEditing ? "Input" : ""}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description*</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isEditing ? "Input" : ""}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Contributeurs</label>
          <div className={styles.inputField}>
            <select
              className={styles.select}
              value=""
              onChange={(e) => {
                if (e.target.value && !selectedMembers.includes(e.target.value)) {
                  setSelectedMembers([...selectedMembers, e.target.value]);
                }
              }}
            >
              <option value="" disabled hidden>
                {selectedMembers.length > 0
                  ? `${selectedMembers.length} collaborateur${selectedMembers.length > 1 ? 's' : ''}`
                  : 'Choisir un ou plusieurs collaborateurs'}
              </option>
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
          {selectedMembers.length > 0 && (
            <div className={styles.selectedMembersList}>
              {selectedMembers.map(memberId => {
                const displayName = getDisplayName(memberId);
                return (
                  <span key={memberId} className={styles.memberTag}>
                    {displayName}
                    <button
                      className={styles.removeMemberBtn}
                      onClick={() => setSelectedMembers(selectedMembers.filter(id => id !== memberId))}
                    >×</button>
                  </span>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.saveBtnWrapper}>
          <button
            className={`${styles.saveBtn} ${(title && description && (hasChanges || !isEditing)) ? styles.saveBtnActive : ''}`}
            onClick={handleSave}
            disabled={!title || !description || (isEditing && !hasChanges)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
