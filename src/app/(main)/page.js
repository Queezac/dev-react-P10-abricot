import { cookies } from 'next/headers';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader/PageHeader';
import DashboardView from '@/components/Dashboard/DashboardView';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return { user: null, tasks: [] };

  try {
    // Paralléliser les deux requêtes
    const [profileRes, tasksRes] = await Promise.all([
      fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      }),
      fetch(`${API_URL}/dashboard/assigned-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      }),
    ]);

    const user = profileRes.ok ? (await profileRes.json()).data?.user : null;
    const tasks = tasksRes.ok ? (await tasksRes.json()).data?.tasks : [];

    return { user, tasks: tasks || [] };
  } catch (error) {
    console.error('Erreur chargement dashboard:', error);
    return { user: null, tasks: [] };
  }
}

export default async function Dashboard() {
  const { user, tasks } = await fetchDashboardData();

  const name = user?.name || user?.email || 'Utilisateur';

  return (
    <div className={styles.dashboard}>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Bonjour ${name}, voici un aperçu de vos projets et tâches`}
      />
      <DashboardView initialTasks={tasks} />
    </div>
  );
}
