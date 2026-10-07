// app/queries/user-reposts.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getUserReposts } from '@/functions/get-user-reposts';

export const userRepostsInfiniteQuery = (username: string) =>
  infiniteQueryOptions({
    queryKey: ['users', 'reposts'],
    queryFn: ({ pageParam }) => getUserReposts({
      username,
      page: pageParam
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });