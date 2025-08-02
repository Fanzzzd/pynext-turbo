'use client';

import type {
  BodyAuthJwtLoginAuthJwtLoginPost as LoginData,
  UserCreate,
  UserRead,
} from '@pynext-turbo/api-client';
import {
  authJwtLoginAuthJwtLoginPost,
  registerRegisterAuthRegisterPost,
  usersCurrentUserUsersMeGet,
} from '@pynext-turbo/api-client';
import { useApiClient } from '@pynext-turbo/api-client/provider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AUTH_TOKEN_KEY = 'pynext-turbo-auth-token';

interface AuthContextType {
  user: UserRead | null;
  signIn: (data: LoginData) => Promise<any>;
  signUp: (data: UserCreate) => Promise<any>;
  signOut: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const client = useApiClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    client.setConfig({
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : { Authorization: undefined },
    });
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, [token, client, queryClient]);

  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => (await usersCurrentUserUsersMeGet({ client })).data,
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  const signInMutation = useMutation({
    mutationFn: (data: LoginData) =>
      authJwtLoginAuthJwtLoginPost({ body: data, client }),
    onSuccess: (response) => {
      const accessToken = (response.data as any).access_token;
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      setToken(accessToken);
      router.push('/');
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: UserCreate) =>
      registerRegisterAuthRegisterPost({ body: data, client }),
    onSuccess: () => {
      alert('Registration successful! Please sign in.');
      router.push('/auth');
    },
  });

  const signOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    queryClient.setQueryData(['user'], null);
    router.push('/auth');
  };

  const value = useMemo(
    () => ({
      user: user ?? null,
      signIn: signInMutation.mutateAsync,
      signUp: signUpMutation.mutateAsync,
      signOut,
      isLoading: isUserLoading || isUserFetching,
      isAuthenticated: !!user && !!token,
      isSigningIn: signInMutation.isPending,
      isSigningUp: signUpMutation.isPending,
    }),
    [
      user,
      signInMutation.mutateAsync,
      signUpMutation.mutateAsync,
      isUserLoading,
      isUserFetching,
      token,
      signInMutation.isPending,
      signUpMutation.isPending,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}