'use client';

import { useState } from 'react';
import styles from './DashboardView.module.css';

// --- Icons ---
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const KanbanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// --- Helpers ---
const getStatusLabel = (status) => {
  switch (status) {
    case 'TODO': return 'À faire';
    case 'IN_PROGRESS': return 'En cours';
    case 'DONE': return 'Terminée';
    default: return status;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(date);
};

// --- Components ---
const TaskCard = ({ task }) => (
  <div className={styles.taskCard}>
    <div className={styles.cardTop}>
      <div className={styles.cardInfo}>
        <h3>{task.title}</h3>
        <p>{task.description || 'Aucune description'}</p>
      </div>
      <span className={`${styles.statusBadge} ${styles['status' + task.status]}`}>
        {getStatusLabel(task.status)}
      </span>
    </div>

    <div className={styles.cardBottom}>
      <div className={styles.metaInfo}>
        <div className={styles.metaItem}>
          <FolderIcon />
          <span>{task.project?.name || 'Projet inconnu'}</span>
        </div>
        <span className={styles.separator}>|</span>
        <div className={styles.metaItem}>
          <CalendarIcon />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <span className={styles.separator}>|</span>
        <div className={styles.metaItem}>
          <MessageIcon />
          <span>{task.comments?.length || 0}</span>
        </div>
      </div>

      <button className={styles.viewBtn}>
        Voir
      </button>
    </div>
  </div>
);

export default function DashboardView({ initialTasks = [] }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = initialTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const todoTasks = filteredTasks.filter(t => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = filteredTasks.filter(t => t.status === 'DONE');

  return (
    <div className={styles.container}>
      {/* Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeList : styles.toggleBtnHover}`}
          onClick={() => setViewMode('list')}
        >
          <ListIcon />
          Liste
        </button>
        <button
          className={`${styles.toggleBtn} ${viewMode === 'kanban' ? styles.activeKanban : styles.toggleBtnHover}`}
          onClick={() => setViewMode('kanban')}
        >
          <KanbanIcon />
          Kanban
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <div className={styles.listTitle}>
              <h2>Mes tâches assignées</h2>
              <p>Par ordre de priorité / échéance</p>
            </div>
            <div className={styles.searchContainer}>
              <div className={styles.searchIcon}><SearchIcon /></div>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Rechercher une tâche"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.taskList}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <p style={{ color: '#71717a' }}>Aucune tâche trouvée</p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.kanbanContainer}>
          {/* Column TODO */}
          <div className={styles.kanbanColumn}>
            <div className={styles.kanbanHeader}>
              <span className={styles.kanbanTitle}>À faire</span>
              <span className={styles.kanbanCount}>{todoTasks.length}</span>
            </div>
            {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>

          {/* Column IN PROGRESS */}
          <div className={styles.kanbanColumn}>
            <div className={styles.kanbanHeader}>
              <span className={styles.kanbanTitle}>En cours</span>
              <span className={styles.kanbanCount}>{inProgressTasks.length}</span>
            </div>
            {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>

          {/* Column DONE */}
          <div className={styles.kanbanColumn}>
            <div className={styles.kanbanHeader}>
              <span className={styles.kanbanTitle}>Terminées</span>
              <span className={styles.kanbanCount}>{doneTasks.length}</span>
            </div>
            {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        </div>
      )}
    </div>
  );
}
