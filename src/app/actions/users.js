'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAllUsersAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return { error: 'Non authentifié', users: [] };

  try {
    const res = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      return { users: json.data?.users || [] };
    }
    return { error: 'Erreur de récupération des utilisateurs', users: [] };
  } catch (error) {
    console.error('Erreur charger les utilisateurs:', error);
    return { error: 'Erreur réseau', users: [] };
  }
}
