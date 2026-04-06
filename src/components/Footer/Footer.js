import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Image
          src="/img/logoBlack.png"
          alt="Abricot Logo Noir"
          width={120}
          height={30}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className={styles.textContainer}>
        <span>Abricot 2025</span>
      </div>
    </footer>
  );
}
