import { cookies } from 'next/headers';
import styles from './page.module.css';
import { redirect } from 'next/navigation';

export default async function Profile() {
  let user = null;
  let debugError = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) debugError = "Token non trouvé dans les cookies";
    else {
      const res = await fetch('http://127.0.0.1:8000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 }
      });
      if (!res.ok) debugError = `Backend a retourné status ${res.status}`;
      else {
        const json = await res.json();
        user = json.data?.user;
        if (!user) debugError = `Format inattendu: ${JSON.stringify(json)}`;
      }
    }
  } catch (e) {
    debugError = `Erreur Fetch RSC: ${e.message}`;
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          <h2>Erreur de chargement du profil</h2>
          <p>{debugError}</p>
        </div>
      </div>
    );
  }

  const names = user.name ? user.name.split(' ') : ['Utilisateur', ''];
  const prenom = names[0];
  const nom = names.slice(1).join(' ') || '';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mon compte</h1>
          <p className={styles.subtitle}>{user.name || user.email}</p>
        </div>

        <form className={styles.form}>
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
              disabled
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

          <button type="button" className={styles.button}>
            Modifier les informations
          </button>
        </form>
      </div>
    </div>
  );
}
