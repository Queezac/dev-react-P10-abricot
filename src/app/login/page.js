export default function Login() {
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="card">
        <h1>Connexion</h1>
        <p>Connectez-vous à votre espace Abricot.co</p>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
