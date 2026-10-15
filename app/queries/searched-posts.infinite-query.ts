// app/queries/searched-posts.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { searchPosts } from '@/functions/search-posts';

export const serchedPostsInfiniteQuery = (query: string) =>
  infiniteQueryOptions({
    queryKey: ['search', 'posts', query],
    queryFn: ({ pageParam }) => searchPosts({ query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });