import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container view-container" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
