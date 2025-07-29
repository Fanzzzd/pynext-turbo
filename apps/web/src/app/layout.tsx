import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ApiProvider } from '@pynext-turbo/api-client/provider';
import { Providers } from './providers';
import { env } from '@/env.mjs';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pynext-Turbo',
  description: 'A modern full-stack monorepo with Next.js and FastAPI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ApiProvider baseURL={env.NEXT_PUBLIC_API_URL}>
            {children}
          </ApiProvider>
        </Providers>
      </body>
    </html>
  );
}
