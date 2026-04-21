'use server';

import { cookies } from 'next/headers';

export async function fetchAllUsersAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return { error: 'Non authentifié', users: [] };

  try {
    const res = await fetch('http://127.0.0.1:8000/users', {
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
