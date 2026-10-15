// app/functions/get-user.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Post } from '@/types/post';

export class SearchPostsError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'SearchPostsError';
  }
}

type Payload = {
  query: string;
  page?: number;
  limit?: number;
};

export const searchPosts = async (payload: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Post>>('/api/v1/search/posts', {
      query: {
        ...payload,
      }
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new SearchPostsError(error.data as ApiErrorResponse);
    }

    throw new SearchPostsError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};