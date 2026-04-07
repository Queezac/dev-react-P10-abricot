'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { register } from '@/app/actions/auth';
import styles from '../auth.module.css';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await register(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className={styles.container}>
      {/* Colonne Gauche - Formulaire */}
      <div className={styles.leftColumn}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/img/LogoOrange.png"
              alt="Abricot Logo"
              width={250}
              height={40}
              style={{ objectFit: 'contain' }}

              priority
            />
          </Link>
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>Inscription</h1>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </button>
          </form>

        </div>

        <div className={styles.footer}>
          Déjà inscrit ? <Link href="/login" className={styles.link}>Se connecter</Link>
        </div>
      </div>

      {/* Colonne Droite - Image */}
      <div className={styles.rightColumn}>
        <Image
          src="/img/image_fond_signin.jpg"
          alt="Register Background"
          width={1000}
          height={1000}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority
        />
      </div>
    </div>
  );
}
