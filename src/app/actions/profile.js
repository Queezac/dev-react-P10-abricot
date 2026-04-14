'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = 'http://127.0.0.1:8000';

export async function updateProfile(formData) {
  const firstName = formData.get('firstName') || '';
  const lastName = formData.get('lastName') || '';
  const email = formData.get('email');
  
  // Combine prenom and nom to form 'name' as expected by backend updateProfile
  const name = `${firstName} ${lastName}`.trim();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { error: 'Non connecté' };
  }

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const json = await res.json();

    if (!res.ok) {
      if (json.data?.errors?.length > 0) {
        return { error: json.data.errors.map(e => e.message).join(' | ') };
      }
      return { error: json.message || 'Erreur lors de la mise à jour' };
    }

    revalidatePath('/profile');
    return { success: true };
  } catch (err) {
    console.error('Update profile error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}
