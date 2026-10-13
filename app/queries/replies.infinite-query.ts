// app/queries/replies.infinite-query.ts

import { infiniteQueryOptions } from '@tanstack/vue-query';
import { getReplies } from '@/functions/get-replies';

export const repliesInfiniteQuery = (commentId: string) =>
  infiniteQueryOptions({
    queryKey: ['replies', commentId],
    queryFn: ({ pageParam }) => getReplies({ commentId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined;
    },
  });