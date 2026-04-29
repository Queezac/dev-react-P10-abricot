import { cookies } from 'next/headers';
import styles from './page.module.css';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function Profile() {
  let user = null;
  let debugError = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) debugError = "Token non trouvé dans les cookies";
    else {
      const res = await fetch(`${API_URL}/auth/profile`, {
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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mon compte</h1>
          <p className={styles.subtitle}>{user.name || user.email}</p>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}
