import CreateProjectButton from '../CreateProjectButton/CreateProjectButton';
import styles from './PageHeader.module.css';

export default function PageHeader({ title, subtitle }) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerText}>
        <h1>{title}</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          {subtitle}
        </p>
      </div>
      <div className={styles.headerButton}>
        <CreateProjectButton />
      </div>
    </div>
  );
}
