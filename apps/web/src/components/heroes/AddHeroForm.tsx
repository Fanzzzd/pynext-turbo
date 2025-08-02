'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createHeroHeroesPost,
  type HeroCreate,
} from '@pynext-turbo/api-client';
import { Button } from '@pynext-turbo/ui';
import { useApiClient } from '@pynext-turbo/api-client/provider';

export function AddHeroForm() {
  const [name, setName] = useState('');
  const [secretName, setSecretName] = useState('');
  const [age, setAge] = useState('');
  const queryClient = useQueryClient();
  const client = useApiClient();

  const { mutate: addHero, isPending } = useMutation({
    mutationFn: (newHero: HeroCreate) =>
      createHeroHeroesPost({ body: newHero, client }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
      setName('');
      setSecretName('');
      setAge('');
      alert('Hero created successfully!');
    },
    onError: () => {
      alert('Failed to create hero. See console for details.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHero({
      name,
      secret_name: secretName,
      age: age ? parseInt(age, 10) : undefined,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Add a New Hero
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Hero Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="e.g., Spider-Man"
            required
          />
        </div>
        <div>
          <label
            htmlFor="secretName"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Secret Identity
          </label>
          <input
            id="secretName"
            value={secretName}
            onChange={(e) => setSecretName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="e.g., Peter Parker"
            required
          />
        </div>
        <div>
          <label
            htmlFor="age"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Age (optional)
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="e.g., 28"
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? 'Adding Hero...' : 'Add Hero'}
        </Button>
      </form>
    </div>
  );
}
