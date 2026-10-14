// app/queries/unread-notifications.query.ts
import { queryOptions } from '@tanstack/vue-query';
import { getUnreadNotifications } from '@/functions/get-unread-notifications';

export const unreadNotificationsQuery = () =>
  queryOptions({
    queryKey: ['unread-notifications'],
    queryFn: getUnreadNotifications,
  });