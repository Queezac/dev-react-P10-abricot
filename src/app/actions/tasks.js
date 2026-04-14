'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = 'http://127.0.0.1:8000';

export async function updateTaskAction(projectId, taskId, data) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { error: 'Non authentifié' };
    }

    // Le backend attend potentiellement title, description, status, dueDate, assigneeId
    const updatePayload = {
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      assigneeId: data.assigneeId || null,
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
    return { success: true, task: json.data?.task };
  } catch (err) {
    console.error('Update task error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}
