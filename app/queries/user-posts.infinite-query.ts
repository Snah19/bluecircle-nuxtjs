// app/queries/user-posts.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getUserPosts } from '@/functions/get-user-posts';

export const userPostsInfiniteQuery = (username: string) =>
  infiniteQueryOptions({
    queryKey: ['users', 'posts'],
    queryFn: ({ pageParam }) => getUserPosts({
      username,
      page: pageParam
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });