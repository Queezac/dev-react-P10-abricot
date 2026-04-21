'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/actions/profile';
import { useToast } from '@/components/Toast/ToastContext';
import styles from './page.module.css';

export default function ProfileForm({ user }) {
  const names = user.name ? user.name.split(' ') : ['Utilisateur', ''];
  const prenom = names[0] || '';
  const nom = names.slice(1).join(' ') || '';

  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) {
      addToast(result.error, 'error');
    } else {
      addToast('Profil mis à jour avec succès !', 'success');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Nom</label>
        <input type="text" defaultValue={nom} className={styles.input} name="lastName" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Prénom</label>
        <input type="text" defaultValue={prenom} className={styles.input} name="firstName" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          defaultValue={user.email}
          className={styles.input}
          name="email"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Mot de passe actuel</label>
        <input
          type="password"
          placeholder="••••••••"
          className={styles.input}
          name="currentPassword"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Nouveau mot de passe</label>
        <input
          type="password"
          placeholder="••••••••"
          className={styles.input}
          name="password"
        />
      </div>

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Enregistrement en cours...' : 'Modifier les informations'}
      </button>
    </form>
  );
}
