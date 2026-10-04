// app/queries/discover-posts.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getDiscoverPosts } from '@/functions/get-discover-posts';

export const discoverPostsInfiniteQuery = () =>
  infiniteQueryOptions({
    queryKey: ['posts', 'discover'],
    queryFn: ({ pageParam }) => getDiscoverPosts({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });