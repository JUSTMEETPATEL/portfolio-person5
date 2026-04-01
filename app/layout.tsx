import type { Metadata } from 'next';
import { Anton, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/AppProvider';
import { CustomCursor } from '@/components/CustomCursor';
import { TransitionOverlay } from '@/components/TransitionOverlay';
import { Background } from '@/components/Background';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Persona 5 Style Portfolio',
  description: 'Interactive AAA-level portfolio inspired by Persona 5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <AppProvider>
          <Background />
          <CustomCursor />
          <TransitionOverlay />
          <main className="relative z-10 w-full h-screen overflow-hidden">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
