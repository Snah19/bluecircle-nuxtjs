// app/queries/searched-users.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { searchUsers } from '~/functions/search-users';

export const searchedUsersInfiniteQuery = (query: string) =>
  infiniteQueryOptions({
    queryKey: ['search', 'users', query],
    queryFn: ({ pageParam }) => searchUsers({ query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });