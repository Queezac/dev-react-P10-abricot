import React from 'react';
import styles from './ProjectGrid.module.css';
import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Vous n'avez aucun projet pour le moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
