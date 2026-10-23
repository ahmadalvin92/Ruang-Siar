import type { Metadata } from 'next';
import './globals.css';
import { getSiteSettings } from '@/lib/data/store';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import GoogleAnalytics from '@/components/GoogleAnalytics';

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
  other: {
    'google-adsense-account': 'ca-pub-5854985607866680',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="id" className="dark">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5854985607866680" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5854985607866680"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-[#090b10] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <GoogleAnalytics gaId={settings.googleAnalyticsId} />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
