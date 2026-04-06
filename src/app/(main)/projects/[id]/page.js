import Link from 'next/link';

export default async function ProjectDetails({ params }) {
  const { id } = await params;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
        }}
      >
        <div>
          <Link
            href="/projects"
            style={{
              fontSize: '0.9rem',
              color: 'var(--muted-foreground)',
              display: 'inline-block',
              marginBottom: '0.5rem',
            }}
          >
            ← Retour aux projets
          </Link>
          <h1>Détail du Projet #{id}</h1>
          <p>La liste de toutes les tâches de ce projet s'affiche ici.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary">Nouvelle Tâche</button>
          <Link href={`/projects/${id}/settings`} className="btn btn-secondary">
            Paramètres du projet
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <section className="card">
          <h2>Génération de tâches par l'IA</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--muted-foreground)' }}>
            Décrivez ce que vous souhaitez accomplir, l'IA d'Abricot se charge
            de créer vos tâches !
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Ex: Je dois créer une page de connexion avec React..."
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            />
            <button className="btn btn-primary">Générer avec l'IA</button>
          </div>
        </section>

        <section className="card">
          <h2>Liste des tâches</h2>
          <div style={{ marginTop: '1rem' }}>
            {/* Placeholder for task list */}
            <div
              style={{
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h4>Création de la maquette</h4>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Due: 12 Nov - Assigné à: Alice
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.6rem',
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  borderRadius: '1rem',
                }}
              >
                À faire
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
