'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateTaskAction(projectId, taskId, data) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { error: 'Non authentifié' };
    }

    const updatePayload = {
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      assigneeIds: data.assigneeIds || [],
    };

    const res = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Erreur lors de la mise à jour de la tâche" };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/projects/${projectId}`);
    return { success: true, task: json.data?.task };
  } catch (err) {
    console.error('Update task error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function createTaskAction(projectId, data) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { error: 'Non authentifié' };
    }

    const payload = {
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      assigneeIds: data.assigneeIds || [],
    };

    const res = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Erreur lors de la création de la tâche" };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/projects/${projectId}`);
    return { success: true, task: json.data?.task };
  } catch (err) {
    console.error('Create task error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function deleteTaskAction(projectId, taskId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { error: 'Non authentifié' };
    }

    const res = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Erreur lors de la suppression de la tâche" };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (err) {
    console.error('Delete task error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}
