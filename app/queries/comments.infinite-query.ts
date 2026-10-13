// app/queries/comments.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getComments } from '@/functions/get-comments';

export const commentsInfiniteQuery = (postId: string) =>
  infiniteQueryOptions({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => getComments({ postId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });