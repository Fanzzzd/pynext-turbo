'use client';

import { useQuery } from '@tanstack/react-query';
import { readHeroesHeroesGet, type HeroRead } from '@pynext-turbo/api-client';
import { HeroCard } from './HeroCard';
import type { AxiosError } from 'axios';
import { useApiClient } from '@pynext-turbo/api-client/provider';

export function HeroList() {
  const client = useApiClient();
  const {
    data: heroes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['heroes'],
    queryFn: async () => (await readHeroesHeroesGet({ client })).data,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Current Heroes
        </h2>
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Loading heroes...
        </div>
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError;
    const errorMsg =
      (axiosError.response?.data as any)?.detail ||
      axiosError.message ||
      'An unknown error occurred';
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Current Heroes
        </h2>
        <div className="py-8 text-center text-red-500">
          An error has occurred: {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Current Heroes ({heroes?.length || 0})
      </h2>
      {heroes && heroes.length > 0 ? (
        <div className="space-y-3">
          {heroes.map((hero: HeroRead) => (
            <HeroCard key={hero.id} hero={hero} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500 dark:text-gray-400">
          No heroes yet. Add the first one!
        </p>
      )}
    </div>
  );
}