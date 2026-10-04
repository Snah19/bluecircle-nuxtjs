// app/functions/get-following-posts.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Post } from '@/types/post';

export class GetFollowingPostsError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetFollowingPostsError';
  }
}

type Payload = {
  page?: number;
  limit?: number;
};

export const getFollowingPosts = async ({ page = 1, limit = 15 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Post>>('api/v1/posts/following', {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetFollowingPostsError(error.data as ApiErrorResponse);
    }

    throw new GetFollowingPostsError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};