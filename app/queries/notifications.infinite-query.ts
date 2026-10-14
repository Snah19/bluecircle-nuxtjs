// app/queries/notifications.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getNotifications } from '@/functions/get-notifications';

export const notificationsInfiniteQuery = () =>
  infiniteQueryOptions({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });