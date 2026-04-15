'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ProjectDetailView.module.css';

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

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + ', ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}


export default function ProjectDetailView({ project, token, currentUser }) {
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const owner = project?.owner;
  const members = project?.members || [];
  const tasks = project?.tasks || [];

  const totalMembers = 1 + members.length;

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'ALL') {
      const isTodo = ['TODO', 'À faire'].includes(task.status);
      const isProgress = ['IN_PROGRESS', 'En cours', 'DOING'].includes(task.status);
      const isDone = ['DONE', 'Terminée'].includes(task.status);

      if (statusFilter === 'TODO' && !isTodo) return false;
      if (statusFilter === 'IN_PROGRESS' && !isProgress) return false;
      if (statusFilter === 'DONE' && !isDone) return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const titleMatch = task.title?.toLowerCase().includes(query);
      const descMatch = task.description?.toLowerCase().includes(query);
      if (!titleMatch && !descMatch) return false;
    }
    return true;
  });

  const sortedAndFilteredTasks = filteredTasks.sort((a, b) => {
    if (viewMode === 'calendar') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      {/* SECTION EN-TÊTE */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/projects" className={styles.backButton}>
            ←
          </Link>
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{project?.name}</h1>
              <a href="#" className={styles.editLink}>Modifier</a>
            </div>
            <p className={styles.description}>
              {project?.description}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnDark}>Créer une tâche</button>
          <button className={styles.btnAI}>
            <svg className={styles.iconAI} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6L12 17.2l-6.2 4.5 2.4-7.6L2 9.6h7.6L12 2z" />
            </svg>
            IA
          </button>
        </div>
      </div>

      {/* SECTION CONTRIBUTEURS */}
      <div className={styles.contributorsBar}>
        <span className={styles.contributorsTitle}>Contributeurs</span>
        <span className={styles.contributorsCount}>{totalMembers} personnes</span>

        <div className={styles.contributorsList}>
          {/* Propriétaire */}
          <div className={styles.contributorOwner}>
            <span className={styles.avatarOrange}>{getInitials(owner)}</span>
            <span className={styles.tagOrange}>Propriétaire</span>
          </div>

          {/* Membres */}
          {members.map((m, idx) => {
            const userName = m.user?.name || m.user?.email || "Contributeur";
            return (
              <div key={idx} className={styles.contributorMember}>
                <span className={styles.avatarGrey}>{getInitials(m.user)}</span>
                <span className={styles.tagGrey}>{userName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION TÂCHES */}
      <div className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <div>
            <h2 className={styles.tasksTitle}>Tâches</h2>
            <p className={styles.tasksSubtitle}>Par ordre de priorité</p>
          </div>

          <div className={styles.tasksControls}>
            {/* Options de Tri */}
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleActive : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg className={styles.toggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                Liste
              </button>
              <button
                className={`${styles.toggleBtn} ${viewMode === 'calendar' ? styles.toggleActive : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <svg className={styles.toggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Calendrier
              </button>
            </div>

            {/* Filtre Statut */}
            <select
              className={styles.filterDropdown}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Statut</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
            </select>

            {/* Recherche */}
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Rechercher une tâche"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* LISTE DES TÂCHES */}
        <div className={styles.tasksList}>
          {sortedAndFilteredTasks.length > 0 ? (
            sortedAndFilteredTasks.map((task, idx) => (
              <TaskItem key={idx} task={task} token={token} currentUser={currentUser} />
            ))
          ) : (
            <div className={styles.emptyTasks}>Aucune tâche correspondant à vos critères.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, token, currentUser }) {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  let statusBadgeClass = styles.badgeTodo;
  let statusLabel = "À faire";

  if (task.status === "IN_PROGRESS" || task.status === "En cours" || task.status === "DOING") {
    statusBadgeClass = styles.badgeProgress;
    statusLabel = "En cours";
  } else if (task.status === "DONE" || task.status === "Terminée") {
    statusBadgeClass = styles.badgeDone;
    statusLabel = "Terminée";
  } else if (task.status === "TODO" || task.status === "À faire") {
    statusBadgeClass = styles.badgeTodo;
    statusLabel = "À faire";
  }

  const assignees = task.assignees || [];

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/projects/${task.projectId}/tasks/${task.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        const data = await res.json();
        setComments([...comments, data.data.comment]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.taskHeader}>
        <div className={styles.taskTitleRow}>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          <span className={`${styles.badge} ${statusBadgeClass}`}>{statusLabel}</span>
        </div>
        <button className={styles.taskMenuBtn}>
          <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      <p className={styles.taskDesc}>
        {task.description}
      </p>

      <div className={styles.taskMeta}>
        <div className={styles.metaItem}>
          <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span className={styles.metaLabel}>Échéance :</span>
          <span className={styles.metaValue}>{task.dueDate ? formatDate(task.dueDate) : "Non définie"}</span>
        </div>

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Assigné à :</span>
          <div className={styles.taskAssignees}>
            {assignees.map((a, i) => (
              <div key={i} className={styles.assigneePill}>
                <span className={styles.avatarMini}>{getInitials(a.user || a)}</span>
                <span className={styles.assigneeName}>{a.user?.name || a.user?.email || "Assigné"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.taskFooter}>
        <button className={styles.commentBtn} onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}>
          Commentaires ({comments.length})
          <svg className={styles.commentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isCommentsExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
          </svg>
        </button>
      </div>

      {isCommentsExpanded && (
        <div className={styles.commentsSection}>
          {comments.map((c, i) => (
            <div key={i} className={styles.commentItem}>
              <div className={styles.commentAvatarSec}>
                <span className={styles.avatarMini}>{getInitials(c.author)}</span>
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentHeaderRow}>
                  <span className={styles.commentAuthorName}>{c.author?.name || c.author?.email || "Utilisateur"}</span>
                  <span className={styles.commentDate}>{c.createdAt ? formatDateTime(c.createdAt) : ""}</span>
                </div>
                <p className={styles.commentContent}>{c.content}</p>
              </div>
            </div>
          ))}

          <div className={styles.addCommentBox}>
            <div className={styles.commentAvatarSec}>
              <span className={styles.avatarMiniUser}>{getInitials(currentUser)}</span>
            </div>
            <div className={styles.addCommentForm}>
              <textarea
                className={styles.addCommentTextarea}
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              />
              <div className={styles.addCommentActions}>
                <button
                  className={styles.submitCommentBtn}
                  onClick={handleAddComment}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
