// app/middleware/redirect-if-authenticated.ts
import { useQueryClient } from '@tanstack/vue-query';
import { meQuery } from '@/queries/me.query';

export default defineNuxtRouteMiddleware(async () => {
  const queryClient = useQueryClient();

  const me = await queryClient
    .query(meQuery())
    .catch(() => null);

  if (me) {
    return navigateTo('/');
  }
});