export default function Register() {
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="card">
        <h1>Inscription</h1>
        <p>Créez votre compte Abricot.co</p>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <div>
            <label htmlFor="name">Nom</label>
            <input
              id="name"
              type="text"
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
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
