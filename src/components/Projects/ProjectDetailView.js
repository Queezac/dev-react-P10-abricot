'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './ProjectDetailView.module.css';
import ProjectModal from './ProjectModal';
import TaskModal from '../Dashboard/TaskModal';
import AiTaskModal from './AiTaskModal';
import { fetchAllUsersAction } from '@/app/actions/users';
import { generateAITasksAction } from '@/app/actions/ai';
import { deleteTaskAction, updateTaskAction, createTaskAction } from '@/app/actions/tasks';
import { updateProjectAction, deleteProjectAction, syncProjectMembersAction } from '@/app/actions/projects';
import { createCommentAction, updateCommentAction, deleteCommentAction } from '@/app/actions/comments';
import { useToast } from '@/components/Toast/ToastContext';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [taskModalState, setTaskModalState] = useState({ isOpen: false, task: null });
  const [allUsers, setAllUsers] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchAllUsersAction().then(res => {
      if (res.users) setAllUsers(res.users);
    });
  }, []);

  const router = useRouter();

  const handleUpdateProject = async (payload) => {
    const result = await updateProjectAction(project.id, payload);
    if (result?.error) {
      addToast(result.error, 'error');
    } else {
      // Sync members
      const currentMemberIds = members.map(m => m.user?.id || m.userId);
      await syncProjectMembersAction(project.id, payload.members || [], currentMemberIds);
      addToast('Projet mis à jour avec succès !', 'success');
      setIsEditModalOpen(false);
      router.refresh();
    }
  };

  const handleGenerateAITasks = async (prompt) => {

    const result = await generateAITasksAction(project.id, prompt);
    if (result?.error) {
      addToast(result.error, 'error');
      throw new Error(result.error);
    } else {
      return result.tasks;
    }
  };

  const handleSaveAITasks = async (tasksToSave) => {
    try {
      let successCount = 0;
      console.log("test");
      for (const task of tasksToSave) {
        const result = await createTaskAction(project.id, {
          title: task.title,
          description: task.description,
          status: task.status || 'TODO',
        });
        console.log(result);
        if (!result.error) {
          successCount++;
        }
      }

      if (successCount === 0) {
        addToast('Impossible d\'enregistrer les tâches', 'error');
        throw new Error('Aucune tâche n\'a pu être enregistrée');
      }

      addToast(`${successCount} tâches générées avec succès !`, 'success');
      router.refresh();
      setIsAiModalOpen(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  const handleDeleteExistingTask = async (taskId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;
    const res = await deleteTaskAction(project.id, taskId);
    if (res?.error) {
      addToast(res.error, 'error');
    } else {
      addToast('Tâche supprimée', 'success');
      router.refresh();
    }
  };

  const handleUpdateExistingTask = async (taskId, updatedData) => {
    const res = await updateTaskAction(project.id, taskId, updatedData);
    if (res?.error) {
      addToast(res.error, 'error');
    } else {
      router.refresh();
    }
  };
  const handleDeleteProject = async () => {
    if (!confirm('Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.')) return;
    const result = await deleteProjectAction(project.id);
    if (result?.error) {
      addToast(result.error, 'error');
    } else {
      addToast('Projet supprimé avec succès', 'success');
      router.push('/projects');
    }
  };

  const owner = project?.owner;
  const members = project?.members || [];
  const tasks = project?.tasks || [];

  const projectUsers = [];
  if (owner && !projectUsers.find(u => u.id === owner.id)) {
    projectUsers.push(owner);
  }
  members.forEach(m => {
    if (m.user && !projectUsers.find(u => u.id === m.user.id)) {
      projectUsers.push(m.user);
    }
  });

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
              <button className={styles.editLink} onClick={() => setIsEditModalOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Modifier</button>
            </div>
            <p className={styles.description}>
              {project?.description}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary" onClick={() => setTaskModalState({ isOpen: true, task: null })}>
            Créer une tâche
          </button>
          <button
            onClick={handleDeleteProject}
            style={{ background: 'none', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            Supprimer
          </button>
          <button className={styles.btnAI} onClick={() => setIsAiModalOpen(true)}>
            <svg className={styles.iconAI} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6L12 17.2l-6.2 4.5 2.4-7.6L2 9.6h7.6L12 2z" />
            </svg>
            IA
          </button>
        </div>
      </div>

      {/* SECTION CONTRIBUTEURS */}
      <div className={styles.contributorsBar}>
        <div className={styles.contributorsNumber}>
          <span className={styles.contributorsTitle}>Contributeurs</span>
          <span className={styles.contributorsCount}>{totalMembers} personnes</span>
        </div>
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
              <TaskItem
                key={task.id || idx}
                task={task}
                token={token}
                currentUser={currentUser}
                onEdit={() => setTaskModalState({ isOpen: true, task })}
                onDelete={async () => {
                  if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
                    const res = await deleteTaskAction(project.id, task.id);
                    if (res?.error) {
                      addToast(res.error, "error");
                    } else {
                      addToast("Tâche supprimée avec succès", "success");
                    }
                  }
                }}
              />
            ))
          ) : (
            <div className={styles.emptyTasks}>Aucune tâche correspondant à vos critères.</div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <ProjectModal
          project={project}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateProject}
          allUsers={allUsers}
        />
      )}

      {taskModalState.isOpen && (
        <TaskModal
          task={taskModalState.task || {}}
          projectId={project?.id}
          allUsers={projectUsers}
          onClose={() => setTaskModalState({ isOpen: false, task: null })}
          onSave={(updatedTask) => {
            setTaskModalState({ isOpen: false, task: null });
          }}
        />
      )}

      {isAiModalOpen && (
        <AiTaskModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onGenerate={handleGenerateAITasks}
          onSave={handleSaveAITasks}
          existingTasks={tasks}
          onDeleteExisting={handleDeleteExistingTask}
          onUpdateExisting={handleUpdateExistingTask}
        />
      )}
    </div>
  );
}

function TaskItem({ task, token, currentUser, onEdit, onDelete }) {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

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
      const res = await createCommentAction(task.projectId, task.id, newComment);
      if (res?.error) {
        console.error(res.error);
      } else if (res?.comment) {
        setComments([...comments, res.comment]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentContent.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await updateCommentAction(task.projectId, task.id, commentId, editCommentContent);
      if (res?.error) {
        console.error(res.error);
      } else if (res?.comment) {
        setComments(comments.map(c => c.id === commentId ? res.comment : c));
        setEditingCommentId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Voulez-vous supprimer ce commentaire ?")) return;
    setIsSubmitting(true);
    try {
      const res = await deleteCommentAction(task.projectId, task.id, commentId);
      if (res?.error) {
        console.error(res.error);
      } else {
        setComments(comments.filter(c => c.id !== commentId));
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
        <div style={{ position: 'relative' }}>
          <button className={styles.taskMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className={styles.taskDropdownMenu}>
              <div className={styles.taskDropdownHeader}>
                <h4 className={styles.taskDropdownTitle}>{task.title}</h4>
                <p className={styles.taskDropdownDesc}>{task.description || "Aucune description"}</p>
              </div>
              <div className={styles.taskDropdownActions}>
                <button
                  onClick={() => { setIsMenuOpen(false); onDelete(); }}
                  className={styles.taskDropdownItemDelete}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Supprimer
                </button>
                <div className={styles.taskDropdownDivider}></div>
                <button
                  onClick={() => { setIsMenuOpen(false); onEdit(); }}
                  className={styles.taskDropdownItemEdit}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Modifier
                </button>
              </div>
            </div>
          )}
        </div>
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
                  {currentUser?.id === c.authorId && (
                    <div className={styles.commentActions}>
                      <button className={styles.commentActionBtn} onClick={() => { setEditingCommentId(c.id); setEditCommentContent(c.content); }}>Modifier</button>
                      <button className={styles.commentActionBtn} onClick={() => handleDeleteComment(c.id)}>Supprimer</button>
                    </div>
                  )}
                </div>
                {editingCommentId === c.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <textarea
                      className={styles.addCommentTextarea}
                      value={editCommentContent}
                      onChange={e => setEditCommentContent(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className={styles.btnSecondary} onClick={() => setEditingCommentId(null)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #e4e4e7', background: 'none' }}>Annuler</button>
                      <button onClick={() => handleUpdateComment(c.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', background: '#18181b', color: 'white', border: 'none' }} disabled={isSubmitting}>Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.commentContent}>{c.content}</p>
                )}
              </div>
            </div>
          ))}

          <div className={styles.addCommentBox}>
            <div className={styles.addCommentBoxInner}>
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
              </div>
            </div>
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
      )}
    </div>
  );
}
