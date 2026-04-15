import React from 'react';
import styles from './ProjectGrid.module.css';
import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects }) {
  // If there are no projects, we can either return empty state or a list of mock projects to match the design.
  // The design shows 6 dummy projects. We will display the real ones!
  // But if empty, we render an empty message.
  
  if (!projects || projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Vous n'avez aucun projet pour le moment.</p>
        {/* We keep the empty state close to the design but communicative. */}
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
