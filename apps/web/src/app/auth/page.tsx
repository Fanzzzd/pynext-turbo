'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
          Pynext-Turbo Heroes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome! Sign in or create an account to continue.
        </p>
      </div>
      <AuthForm />
    </main>
  );
}
