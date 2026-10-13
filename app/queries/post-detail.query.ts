// app/queries/post-detail.query.ts

import { queryOptions } from '@tanstack/vue-query';
import { getPostDetail } from '~/functions/get-post-detail';

export const postDetailQuery = (postId: string) =>
  queryOptions({
    queryKey: ['posts', postId],
    queryFn: () => getPostDetail({ postId }),
  });