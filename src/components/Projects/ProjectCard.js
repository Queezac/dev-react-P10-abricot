import React from 'react';
import Link from 'next/link';
import styles from './ProjectCard.module.css';

function getInitials(user) {
  if (!user) return '??';
  if (user.name) {
    const parts = user.name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return user.name.substring(0, 2).toUpperCase();
  }
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  return '??';
}

export default function ProjectCard({ project }) {
  const name = project?.name;
  const description = project?.description;
  
  // Calcul de la progression des tâches
  // Nous n'avons pas encore le nombre de tâches terminées depuis le backend, on simule 0
  const totalTasks = project?._count?.tasks || 0;
  const completedTasks = 0; 
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalMembers = 1 + (project?.members?.length || 0);

  return (
    <Link 
      href={`/projects/${project?.id || '#'}`} 
      className={styles.card}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progression</span>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className={styles.progressFooter}>
          {completedTasks}/{totalTasks} tâches terminées
        </div>
      </div>

      <div className={styles.teamSection}>
        <div className={styles.teamHeader}>
          <svg className={styles.teamIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Équipe ({totalMembers})</span>
        </div>
        <div className={styles.teamMembersList}>
          <div className={styles.ownerGroup}>
            <span className={styles.avatarOrange}>{getInitials(project?.owner)}</span>
            <span className={styles.labelOrange}>Propriétaire</span>
          </div>
          {project?.members && project.members.length > 0 && (
            <div className={styles.membersGroup}>
              {project.members.slice(0, 3).map((m, idx) => (
                 <span key={idx} className={styles.avatarGrey}>{getInitials(m.user)}</span>
              ))}
              {project.members.length > 3 && (
                <span className={styles.avatarGrey}>+{project.members.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
