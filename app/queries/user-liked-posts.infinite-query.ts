// app/queries/user-liked-posts.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getUserLikedPosts } from '@/functions/get-user-liked-posts';

export const userLikedPostsInfiniteQuery = (username: string) =>
  infiniteQueryOptions({
    queryKey: ['users', 'liked-posts'],
    queryFn: ({ pageParam }) => getUserLikedPosts({
      username,
      page: pageParam
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });