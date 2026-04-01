import Link from 'next/link';

export default function CreateProjectButton() {
  return (
    <Link href="/projects/new" className="btn btn-secondary">
      + Créer un projet
    </Link>
  );
}
