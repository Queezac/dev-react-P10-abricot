import Link from 'next/link';

export default async function ProjectSettings({ params }) {
  const { id } = await params;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link
        href={`/projects/${id}`}
        style={{
          fontSize: '0.9rem',
          color: 'var(--muted-foreground)',
          display: 'inline-block',
          marginBottom: '1rem',
        }}
      >
        ← Retour au projet
      </Link>
      <h1>Paramètres du Projet #{id}</h1>
      <p style={{ marginBottom: '2rem' }}>
        Modifier les informations ou gérer les contributeurs.
      </p>

      <div className="card">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="settings-project-name">Nom du projet :</label>
            <input
              id="settings-project-name"
              type="text"
              defaultValue="Projet existant"
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
            <label htmlFor="settings-project-desc">Description :</label>
            <textarea
              id="settings-project-desc"
              defaultValue="Description actuelle du projet..."
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

          <div style={{ marginTop: '1rem' }}>
            <h3>Contributeurs</h3>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <li
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span>alice@example.com (Admin)</span>
              </li>
              <li
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span>bob@example.com (Contributeur)</span>
                <button
                  type="button"
                  style={{
                    color: 'var(--danger)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Retirer
                </button>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="settings-add-contributor">Ajouter un contributeur (email) :</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <input
                id="settings-add-contributor"
                type="email"
                placeholder="email@exemple.com"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              />
              <button type="button" className="btn btn-secondary">
                Inviter
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
            }}
          >
            <button type="submit" className="btn btn-primary">
              Enregistrer les m.a.j.
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ color: 'var(--danger)' }}
            >
              Supprimer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
