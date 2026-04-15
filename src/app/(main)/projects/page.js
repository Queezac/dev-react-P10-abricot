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

  // Si on veut forcer l'affichage avec des fausses données (mocks) en cas de 0 projets,
  // ou si la BDD est vide, on peut décommenter ce code pour simuler :
  /*
  if (projects.length === 0) {
    projects.push(
      ...Array(6).fill(null).map((_, i) => ({
        id: `mock-${i}`,
        name: "Développement de la nouvelle version de l'API REST avec authentification JWT",
        description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
        owner: { name: "A D" },
        members: [{ user: { name: "B C" } }, { user: { name: "C V" } }],
        _count: { tasks: 2 }
      }))
    );
  }
  */

  return (
    <div className={styles.project}>
      <PageHeader title="Mes projets" subtitle="Gérez vos projets" />
      <ProjectGrid projects={projects} />
    </div>
  );
}
