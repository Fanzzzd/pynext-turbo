'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { createClient, type Client, createConfig } from './requests/client';

const ApiClientContext = createContext<Client | null>(null);

export function useApiClient() {
  const client = useContext(ApiClientContext);
  if (client === null) {
    throw new Error('useApiClient must be used within an ApiProvider');
  }
  return client;
}

export const ApiProvider = ({
  children,
  baseURL,
}: {
  children: React.ReactNode;
  baseURL: string;
}) => {
  const client = useMemo(
    () =>
      createClient(
        createConfig({
          baseURL: baseURL,
          throwOnError: true,
        })
      ),
    [baseURL]
  );

  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
};
