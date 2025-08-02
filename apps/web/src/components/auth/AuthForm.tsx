'use client';

import { useAuth } from '@/lib/auth';
import { Button } from '@pynext-turbo/ui';
import { useState } from 'react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isSigningIn, isSigningUp } = useAuth();

  const isLoading = isSigningIn || isSigningUp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signIn({ username: email, password });
      } else {
        await signUp({ email, password });
      }
    } catch (err: any) {
      const errorDetail =
        err.error?.detail || err.message || 'An unknown error occurred.';
      setError(
        typeof errorDetail === 'string'
          ? errorDetail
          : JSON.stringify(errorDetail)
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="••••••••"
            required
            minLength={isLogin ? undefined : 8}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading
              ? 'Processing...'
              : isLogin
                ? 'Sign In'
                : 'Create Account'}
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
}