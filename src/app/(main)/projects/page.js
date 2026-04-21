import { cookies } from 'next/headers';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader/PageHeader';
import ProjectGrid from '@/components/Projects/ProjectGrid';

async function fetchProjects() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return [];

  try {
    const res = await fetch('http://127.0.0.1:8000/projects', {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      return json.data?.projects || [];
    }
    return [];
  } catch (error) {
    console.error('Erreur chargement projets:', error);
    return [];
  }
}

export default async function Projects() {
  const projects = await fetchProjects();

  return (
    <div className={styles.project}>
      <PageHeader title="Mes projets" subtitle="Gérez vos projets" />
      <ProjectGrid projects={projects} />
    </div>
  );
}
