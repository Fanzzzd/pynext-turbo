'use client';

import { useQuery } from '@tanstack/react-query';
import { readHeroesHeroesGet, type HeroRead } from '@pynext-turbo/api-client';
import { HeroCard } from './HeroCard';

export function HeroList() {
  const {
    data: heroes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['heroes'],
    queryFn: async () => {
      const response = await readHeroesHeroesGet();
      // The client returns an object with an `error` property on failure.
      // We need to throw the error for react-query to handle it correctly.
      if (response.error) {
        throw response;
      }
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        Loading heroes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        An error has occurred: {error.message}
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
