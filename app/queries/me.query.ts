// app/queries/me.query.ts
import { queryOptions } from '@tanstack/vue-query';
import { getMe } from '@/functions/get-me';

export const meQuery = () => {
  const nuxtApp = useNuxtApp();

  return queryOptions({
    queryKey: ['me'],
    queryFn: () => nuxtApp.runWithContext(() => getMe()),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};