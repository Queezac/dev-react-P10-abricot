import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Abricot.co - Gestion de projet innovante',
  description:
    "L'outil SaaS de gestion de projet qui utilise l'IA pour optimiser les flux de travail des freelances.",
};

import { ToastProvider } from '@/components/Toast/ToastContext';

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
