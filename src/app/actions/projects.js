'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function createProjectAction(data) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Non authentifié' };

    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: data.name, description: data.description }),
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || 'Erreur lors de la création du projet' };

    if (data.members && data.members.length > 0 && json.data?.project?.id) {
      const projectId = json.data.project.id;
      for (const userId of data.members) {
        await addContributorByIdAction(projectId, userId, token);
      }
    }

    revalidatePath('/projects');
    return { success: true, project: json.data?.project };
  } catch (err) {
    console.error('Create project error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function updateProjectAction(projectId, data) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Non authentifié' };

    const res = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: data.name, description: data.description }),
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || 'Erreur lors de la mise à jour' };

    revalidatePath(`/projects/${projectId}`);
    revalidatePath('/projects');
    return { success: true, project: json.data?.project };
  } catch (err) {
    console.error('Update project error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function deleteProjectAction(projectId) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Non authentifié' };

    const res = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || 'Erreur lors de la suppression' };

    revalidatePath('/projects');
    return { success: true };
  } catch (err) {
    console.error('Delete project error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

async function addContributorByIdAction(projectId, userId, token) {
  try {
    const usersRes = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!usersRes.ok) return;
    const usersJson = await usersRes.json();
    const user = (usersJson.data?.users || []).find(u => u.id === userId);
    if (!user) return;

    await fetch(`${API_URL}/projects/${projectId}/contributors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email: user.email }),
    });
  } catch (err) {
    console.error('Add contributor error:', err);
  }
}

export async function syncProjectMembersAction(projectId, newMemberIds, currentMemberIds) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Non authentifié' };

    const usersRes = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const usersJson = await usersRes.json();
    const allUsers = usersJson.data?.users || [];

    const toAdd = newMemberIds.filter(id => !currentMemberIds.includes(id));
    const toRemove = currentMemberIds.filter(id => !newMemberIds.includes(id));

    for (const userId of toRemove) {
      await fetch(`${API_URL}/projects/${projectId}/contributors/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    for (const userId of toAdd) {
      const user = allUsers.find(u => u.id === userId);
      if (!user) continue;
      await fetch(`${API_URL}/projects/${projectId}/contributors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: user.email }),
      });
    }

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (err) {
    console.error('Sync members error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}
