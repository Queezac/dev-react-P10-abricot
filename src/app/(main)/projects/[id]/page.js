import { cookies } from 'next/headers';
import ProjectDetailView from '@/components/Projects/ProjectDetailView';
import { notFound } from 'next/navigation';

async function fetchProject(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const res = await fetch(`http://127.0.0.1:8000/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      return json.data?.project || null;
    }
    return null;
  } catch (error) {
    console.error('Erreur chargement projet:', error);
    return null;
  }
}

async function fetchProfile(token) {
  if (!token) return null;
  try {
    const res = await fetch('http://127.0.0.1:8000/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    return res.ok ? (await res.json()).data?.user : null;
  } catch (error) {
    return null;
  }
}

export default async function ProjectDetails({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  const [project, currentUser] = await Promise.all([
    fetchProject(id),
    fetchProfile(token)
  ]);

  if (!project) {
    return notFound();
  }

  return <ProjectDetailView project={project} token={token} currentUser={currentUser} />;
}
