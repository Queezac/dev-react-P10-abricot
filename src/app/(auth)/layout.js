export default function AuthLayout({ children }) {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </main>
  );
}
