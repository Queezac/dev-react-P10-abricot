'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const LayoutIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.icon}
  >
    <rect width="7" height="5" x="3" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="16" rx="1" />
    <rect width="7" height="9" x="3" y="12" rx="1" />
  </svg>
);

const FolderIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={styles.icon}
  >
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

export default function Navbar({ user }) {
  const pathname = usePathname();

  let initials = "AD";
  if (user && user.name) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      initials = user.name.substring(0, 2).toUpperCase();
    }
  } else if (user && user.email) {
    initials = user.email.substring(0, 2).toUpperCase();
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/img/LogoOrange.png"
            alt="Abricot Logo"
            width={140}
            height={35}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      <div className={styles.navCenter}>
        <Link
          href="/"
          className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
        >
          <LayoutIcon />
          <span>Tableau de bord</span>
        </Link>
        <Link
          href="/projects"
          className={`${styles.navLink} ${pathname?.startsWith('/projects') ? styles.active : ''}`}
        >
          <FolderIcon />
          <span>Projets</span>
        </Link>
      </div>

      <div className={styles.userActions}>
        <Link 
          href="/profile" 
          className={`${styles.avatar} ${pathname === '/profile' ? styles.avatarActive : ''}`} 
          title={user?.name || user?.email || 'Profile'}
        >
          {initials}
        </Link>
      </div>
    </nav>
  );
}
