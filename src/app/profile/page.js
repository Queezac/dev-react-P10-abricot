import styles from './page.module.css';

export default function Profile() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mon compte</h1>
          <p className={styles.subtitle}>Amélie Dupont</p>
        </div>

        <form className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nom</label>
            <input type="text" defaultValue="Dupont" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Prénom</label>
            <input type="text" defaultValue="Amélie" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              defaultValue="a.dupont@mail.com"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mot de passe</label>
            <input
              type="password"
              defaultValue="monmotdepasse"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            Modifier les informations
          </button>
        </form>
      </div>
    </div>
  );
}
