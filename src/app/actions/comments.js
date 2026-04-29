'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function createCommentAction(projectId, taskId, content) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Non authentifié' };

    const res = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Erreur lors de la création du commentaire" };

    revalidatePath(`/projects/${projectId}`);
    return { success: true, comment: json.data?.comment };
  } catch (err) {
    console.error('Create comment error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function updateCommentAction(projectId, taskId, commentId, content) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Non authentifié' };

    const res = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Erreur lors de la mise à jour du commentaire" };

    revalidatePath(`/projects/${projectId}`);
    return { success: true, comment: json.data?.comment };
  } catch (err) {
    console.error('Update comment error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function deleteCommentAction(projectId, taskId, commentId) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Non authentifié' };

    const res = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Erreur lors de la suppression du commentaire" };

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (err) {
    console.error('Delete comment error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}
