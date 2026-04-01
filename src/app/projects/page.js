import styles from './page.module.css';
import PageHeader from '@/components/PageHeader/PageHeader';

export default function Projects() {
  return (
    <div className={styles.project}>
      <PageHeader title="Mes projets" subtitle="Gérez vos projets" />
    </div>
  );
}
