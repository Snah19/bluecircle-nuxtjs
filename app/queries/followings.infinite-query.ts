// app/queries/followings.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getFollowings } from '@/functions/get-followings';

export const followingsInfiniteQuery = (username: string) =>
  infiniteQueryOptions({
    queryKey: [username, 'followings'],
    queryFn: ({ pageParam }) => getFollowings({
      username,
      page: pageParam
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });