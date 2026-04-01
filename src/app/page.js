import styles from './page.module.css';
import PageHeader from '@/components/PageHeader/PageHeader';

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <PageHeader
        title="Tableau de Bord"
        subtitle="Bonjour Alice Dupont, voici un aperçu de vos projets et tâches"
      />
    </div>
  );
}
