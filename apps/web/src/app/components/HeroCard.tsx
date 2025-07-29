'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type HeroRead,
  deleteHeroHeroesHeroIdDelete,
} from '@pynext-turbo/api-client';
import { Button } from '@pynext-turbo/ui';
import type { AxiosError } from 'axios';
import { useApiClient } from '@pynext-turbo/api-client/provider';

type HeroCardProps = {
  hero: HeroRead;
};

export function HeroCard({ hero }: HeroCardProps) {
  const queryClient = useQueryClient();
  const client = useApiClient();

  const { mutate: deleteHero, isPending } = useMutation({
    mutationFn: (heroId: number) =>
      deleteHeroHeroesHeroIdDelete({ path: { hero_id: heroId }, client }),
    onMutate: async (heroId) => {
      await queryClient.cancelQueries({ queryKey: ['heroes'] });
      const previousHeroes = queryClient.getQueryData<HeroRead[]>(['heroes']);
      const optimisticHeroes = previousHeroes?.filter((h) => h.id !== heroId);
      queryClient.setQueryData(['heroes'], optimisticHeroes);
      return { previousHeroes };
    },
    onError: (error: AxiosError, heroId, context) => {
      queryClient.setQueryData(['heroes'], context?.previousHeroes);
      const errorMsg =
        (error.response?.data as any)?.detail ||
        error.message ||
        'An unknown error occurred';
      alert(`Failed to delete hero: ${errorMsg}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });

  return (
    <div className="flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {hero.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Secret Identity: {hero.secret_name}
        </p>
        {hero.age && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Age: {hero.age}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          ID: {hero.id}
        </span>
        <Button
          onClick={() => deleteHero(hero.id)}
          disabled={isPending}
          variant="danger"
          size="sm"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}