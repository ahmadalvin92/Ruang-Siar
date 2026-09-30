import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'RUANG SIAR - Media & Radio Siar Kontemporer Indonesia',
    template: '%s | RUANG SIAR',
  },
  description:
    'Sajian siaran audio-visual kontemporer nusantara bertenaga playlist kurasi YouTube resmi. Dengarkan obrolan hangat, musik pilihan, dan kabar terkini.',
  keywords: [
    'Ruang Siar',
    'Radio Indonesia',
    'Siaran YouTube',
    'Podcast Video',
    'Media Digital Nusantara',
    'Playlist Musik Indonesia',
  ],
  authors: [{ name: 'Ruang Siar Redaksi' }],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'RUANG SIAR - Media & Radio Siar Kontemporer Indonesia',
    description:
      'Sajian siaran audio-visual kontemporer nusantara bertenaga playlist kurasi YouTube resmi.',
    url: 'https://ruangsiar.id',
    siteName: 'RUANG SIAR',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#090b10] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
