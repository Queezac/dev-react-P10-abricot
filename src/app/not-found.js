import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: '404 - Page introuvable | Abricot.co',
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.orbTop} />
      <div className={styles.orbBottom} />

      <div className={styles.content}>
        <div className={styles.badge}>Erreur 404</div>

        <h1 className={styles.code}>
          <span className={styles.codeHighlight}>404</span>
        </h1>

        <h2 className={styles.title}>Page introuvable</h2>

        <p className={styles.description}>
          Oups ! La page que vous cherchez semble avoir disparu dans les limbes
          du projet. Elle a peut-être été déplacée, supprimée ou n&apos;a jamais
          existé.
        </p>
      </div>

      <div className={styles.grid} aria-hidden="true" />
    </div>
  );
}
