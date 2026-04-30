'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateProfile(formData) {
  const firstName = formData.get('firstName') || '';
  const lastName = formData.get('lastName') || '';
  const email = formData.get('email');

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

    const newPassword = formData.get('password');
    const currentPassword = formData.get('currentPassword');

    if (newPassword && newPassword.length > 0) {
      if (!currentPassword) {
        return { error: "Mot de passe actuel requis pour modifier le mot de passe" };
      }
      const passRes = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const passJson = await passRes.json();
      if (!passRes.ok) {
        return { error: passJson.message || "Erreur lors de la modification du mot de passe" };
      }
    }

    revalidatePath('/profile');
    return { success: true };
  } catch (err) {
    console.error('Update profile error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}
