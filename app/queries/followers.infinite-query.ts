// app/queries/followers.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getFollowers } from '@/functions/get-followers';

export const followersInfiniteQuery = (username: string) =>
  infiniteQueryOptions({
    queryKey: [username, 'followers'],
    queryFn: ({ pageParam }) => getFollowers({
      username,
      page: pageParam
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });