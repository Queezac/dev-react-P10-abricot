'use client';

import { useState, useEffect } from 'react';
import styles from './DashboardView.module.css';
import TaskModal from './TaskModal';
import { fetchAllUsersAction } from '@/app/actions/users';


const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);




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

const TaskCard = ({ task, onEdit }) => (
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
          <i className="fa-solid fa-folder-open" aria-hidden="true"></i>
          <span>{task.project?.name || 'Projet inconnu'}</span>
        </div>
        <span className={styles.separator}>|</span>
        <div className={styles.metaItem}>
          <i className="fa-regular fa-calendar" aria-hidden="true"></i>
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <span className={styles.separator}>|</span>
        <div className={styles.metaItem}>
          <img src="/img/icons/comment.svg" alt="Commentaires" width={14} height={14} />
          <span>{task.comments?.length || 0}</span>
        </div>
      </div>

      <button className={styles.viewBtn} onClick={() => onEdit(task)}>
        Voir
      </button>
    </div>
  </div>
);

export default function DashboardView({ initialTasks = [] }) {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAllUsersAction().then(res => {
      if (res.users) setAllUsers(res.users);
    });
  }, []);

  const handleUpdateTask = (updatedTask) => {
    console.log("Tâche modifiée:", updatedTask);
    setSelectedTask(null);
  };

  const filteredTasks = initialTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const todoTasks = filteredTasks.filter(t => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = filteredTasks.filter(t => t.status === 'DONE');

  return (
    <div className={styles.container}>
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeList : styles.toggleBtnHover}`}
          onClick={() => setViewMode('list')}
        >
          <i className="fa-regular fa-square-check" aria-hidden="true"></i>
          Liste
        </button>
        <button
          className={`${styles.toggleBtn} ${viewMode === 'kanban' ? styles.activeKanban : styles.toggleBtnHover}`}
          onClick={() => setViewMode('kanban')}
        >
          <i className="fa-regular fa-calendar" aria-hidden="true"></i>
          Kanban
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <div className={styles.listTitle}>
              <h2>Mes tâches assignées</h2>
              <p>Par ordre de priorité</p>
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
              filteredTasks.map(task => <TaskCard key={task.id} task={task} onEdit={setSelectedTask} />)
            ) : (
              <p style={{ color: '#71717a' }}>Aucune tâche trouvée</p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.kanbanContainer}>
          <div className={styles.kanbanColumn}>
            <div className={styles.kanbanHeader}>
              <span className={styles.kanbanTitle}>À faire</span>
              <span className={styles.kanbanCount}>{todoTasks.length}</span>
            </div>
            {todoTasks.map(task => <TaskCard key={task.id} task={task} onEdit={setSelectedTask} />)}
          </div>

          <div className={styles.kanbanColumn}>
            <div className={styles.kanbanHeader}>
              <span className={styles.kanbanTitle}>En cours</span>
              <span className={styles.kanbanCount}>{inProgressTasks.length}</span>
            </div>
            {inProgressTasks.map(task => <TaskCard key={task.id} task={task} onEdit={setSelectedTask} />)}
          </div>

          <div className={styles.kanbanColumn}>
            <div className={styles.kanbanHeader}>
              <span className={styles.kanbanTitle}>Terminées</span>
              <span className={styles.kanbanCount}>{doneTasks.length}</span>
            </div>
            {doneTasks.map(task => <TaskCard key={task.id} task={task} onEdit={setSelectedTask} />)}
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleUpdateTask}
          allUsers={allUsers}
        />
      )}
    </div>
  );
}
