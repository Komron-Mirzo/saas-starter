import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Poppins, Syne } from 'next/font/google';
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

// 2. Setup temporary bold headline font for Worthfit placeholders
const temporaryWorthfit = Syne({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-worthfit',
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${temporaryWorthfit.variable} h-full`}
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