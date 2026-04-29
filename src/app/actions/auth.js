'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      if (json.data?.errors?.length > 0) {
        return { error: json.data.errors.map(e => e.message).join(' | ') };
      }
      return { error: json.message || 'Erreur lors de la connexion' };
    }

    const token = json.data?.token || json.token;

    if (token) {
      // Stockage sécurisé du token dans un cookie HTTP-only
      const cookieStore = await cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 sem
        path: '/',
      });

      return { success: true };
    } else {
      return { error: 'Token non reçu' };
    }
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function register(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name'); // Récupération du nom

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const json = await res.json();

    if (!res.ok) {
      if (json.data?.errors?.length > 0) {
        return { error: json.data.errors.map(e => e.message).join(' | ') };
      }
      return { error: json.message || "Erreur lors de l'inscription" };
    }

    const token = json.data?.token || json.token;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return { success: true };
    } else {
      return { error: 'Token non reçu' };
    }
  } catch (err) {
    console.error('Register error:', err);
    return { error: 'Impossible de joindre le serveur' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}
