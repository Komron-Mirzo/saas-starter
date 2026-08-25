import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';

export const metadata: Metadata = {
  title: 'Worthfit SaaS',
  description: 'Build your fitness and SaaS future faster.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

// 1. Setup Poppins for body/subheads
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
});

// 2. Setup your custom local worthfit headline font
const worthfit = localFont({
  src: '/fonts/worthfit.woff2',
  variable: '--font-worthfit',
  display: 'swap',
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${worthfit.variable} h-full`}
    >
      <body className="min-h-[100dvh] font-sans antialiased bg-background text-foreground flex flex-col">
        <SWRConfig
          value={{
            fallback: {
              '/api/user': getUser(),
              '/api/team': getTeamForUser()
            }
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}