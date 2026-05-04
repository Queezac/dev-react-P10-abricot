export default function NewProject() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Créer un nouveau projet</h1>
      <p style={{ marginBottom: '2rem' }}>
        Initialisez un projet pour commencer à collaborer.
      </p>

      <div className="card">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="new-project-name">Nom du projet :</label>
            <input
              id="new-project-name"
              type="text"
              placeholder="Ex: Refonte du site web"
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
            <label htmlFor="new-project-desc">Description :</label>
            <textarea
              id="new-project-desc"
              placeholder="Description de l'objectif du projet..."
              rows="4"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                resize: 'vertical',
              }}
            ></textarea>
          </div>

          <div>
            <label htmlFor="new-project-contributors">Inviter des contributeurs (emails):</label>
            <input
              id="new-project-contributors"
              type="text"
              placeholder="Ex: bob@example.com, alice@example.com"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Créer le projet
            </button>
            <button type="button" className="btn btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
