import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchProfileData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    return res.ok ? (await res.json()).data?.user : null;
  } catch (error) {
    console.error('Erreur chargement profil (layout):', error);
    return null;
  }
}

export default async function MainLayout({ children }) {
  const user = await fetchProfileData();

  return (
    <>
      <Navbar user={user} />
      <main className="container view-container" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
