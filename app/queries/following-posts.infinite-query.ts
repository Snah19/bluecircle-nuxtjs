// app/queries/following-posts.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getFollowingPosts } from '@/functions/get-following-posts';

export const followingPostsInfiniteQuery = () =>
  infiniteQueryOptions({
    queryKey: ['posts', 'followings'],
    queryFn: ({ pageParam }) => getFollowingPosts({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPost) => {
      return lastPost.meta.page < lastPost.meta.lastPage ? lastPost.meta.page + 1 : undefined;
    },
  });