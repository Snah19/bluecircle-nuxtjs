// app/queries/unread-notifications.query.ts
import { queryOptions } from '@tanstack/vue-query';
import { getUnreadNotifications } from '@/functions/get-unread-notifications';

export const unreadNotificationsQuery = () => {
  const nuxtApp = useNuxtApp();

  return queryOptions({
    queryKey: ['unread-notifications'],
    queryFn: () => nuxtApp.runWithContext(() => getUnreadNotifications()),
  });
};