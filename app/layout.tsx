import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import { BottomNav } from '@/components/BottomNav';
import { Player } from '@/components/Player';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';
import { TrackMenu } from '@/components/TrackMenu';
import { PWARegister } from '@/components/PWARegister';
import { BackgroundProvider } from '@/components/BackgroundProvider';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Stream Beats',
  description: 'Platform streaming musik modern gratis tanpa iklan',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Stream Beats',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="text-white antialiased pb-24 min-h-screen" suppressHydrationWarning>
        <AuthProvider />
        <BackgroundProvider />
        <PWARegister />
        {children}
        <Player />
        <BottomNav />
        <AddToPlaylistModal />
        <TrackMenu />
      </body>
    </html>
  );
}
