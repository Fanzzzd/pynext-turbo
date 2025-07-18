'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useEffect, useState } from 'react';
import { client } from './requests/client.gen';

export const ApiProvider = ({
  children,
  baseURL,
}: {
  children: React.ReactNode;
  baseURL: string;
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    client.setConfig({
      baseURL: baseURL,
    });
    setIsMounted(true);
  }, [baseURL]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isMounted && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
