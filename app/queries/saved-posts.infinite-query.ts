// app/queries/user-liked-posts.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getSavedPosts } from '@/functions/get-user-saved-posts';

export const savedPostsInfiniteQuery = () =>
  infiniteQueryOptions({
    queryKey: ['users', 'saved-posts'],
    queryFn: ({ pageParam }) => getSavedPosts({
      page: pageParam
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });