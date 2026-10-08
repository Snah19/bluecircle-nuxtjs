// app/functions/get-saved-posts.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Post } from '@/types/post';

export class GetSavedPosts extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetSavedPosts';
  }
}

type Payload = {
  page?: number;
  limit?: number;
};

export const getSavedPosts = async ({ page = 1, limit = 15 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Post>>('/api/v1/me/saved-posts', {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetSavedPosts(error.data as ApiErrorResponse);
    }

    throw new GetSavedPosts({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};