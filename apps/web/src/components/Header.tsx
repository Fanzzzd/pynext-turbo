'use client';

import { useAuth } from '@/lib/auth';
import { Button } from '@pynext-turbo/ui';
import Link from 'next/link';

export function Header() {
  const { user, signOut, isAuthenticated } = useAuth();

  return (
    <header className="mb-12 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pynext-Turbo Heroes
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </span>
              <Button onClick={signOut} size="sm" variant="secondary">
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
