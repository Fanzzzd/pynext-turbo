'use client';

import Link from 'next/link';
import { AddHeroForm } from '@/components/heroes/AddHeroForm';
import { Header } from '@/components/layout/Header';
import { HeroList } from '@/components/heroes/HeroList';
import { useAuth } from '@/lib/auth';
import { Button } from '@pynext-turbo/ui';

const Feature = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="text-center">
    <div className="mb-2 text-3xl">{icon}</div>
    <h3 className="mb-2 font-semibold">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
  </div>
);

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Header />

        {isAuthenticated ? (
          <div className="grid gap-8 md:grid-cols-2">
            <HeroList />
            <AddHeroForm />
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Welcome!
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Please sign in to manage your heroes.
            </p>
            <Button asChild size="lg">
              <Link href="/auth">Go to Sign In</Link>
            </Button>
          </div>
        )}

        <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:from-gray-800 dark:to-gray-900">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            🚀 Pynext-Turbo Features
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Feature icon="⚡" title="Type Safety">
              End-to-end type safety from FastAPI to React components
            </Feature>
            <Feature icon="🎯" title="Auto-Generated">
              API clients generated automatically from OpenAPI schemas
            </Feature>
            <Feature icon="📦" title="Monorepo">
              Shared packages and optimized builds with Turborepo
            </Feature>
          </div>
        </div>
      </div>
    </main>
  );
}
