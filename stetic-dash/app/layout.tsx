import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Pinyon_Script } from 'next/font/google';
import localFont from 'next/font/local';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const pinyon = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

const robotoMono = localFont({
  src: '../assets/fonts/RobotoMono-VariableFont_wght.ttf',
  variable: '--font-mono',
  display: 'swap',
});

const smoothSans = localFont({
  src: '../assets/fonts/SmoochSans-VariableFont_wght.ttf',
  variable: '--font-smooth',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KAD BAY Studio | Estudio de Belleza',
  description: 'Universo visual cálido, luminoso y de lujo sereno para tu estudio de belleza.',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable} ${pinyon.variable} ${robotoMono.variable}`}>
      <body className="antialiased min-h-screen bg-[#FAF7F2] text-[#24150E]">
        <SmoothScroll>{children}</SmoothScroll>
        {modal}
      </body>
    </html>
  );
}
