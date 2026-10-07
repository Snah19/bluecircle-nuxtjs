// app/functions/get-user-posts.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Post } from '@/types/post';

export class GetUserPosts extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetUserPosts';
  }
}

type Payload = {
  username: string;
  page?: number;
  limit?: number;
};

export const getUserPosts = async ({ username, page = 1, limit = 15 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Post>>(`/api/v1/users/${username}/posts`, {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetUserPosts(error.data as ApiErrorResponse);
    }

    throw new GetUserPosts({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};