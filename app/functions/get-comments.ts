// app/functions/get-post-detail.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Comment } from '@/types/comment';

export class GetCommentsError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetCommentsError';
  }
}

type Payload = {
  postId: string;
  page?: number;
  limit?: number;
};

export const getComments = async ({ postId, page = 1, limit = 15 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Comment>>(`api/v1/posts/${postId}/comments`, {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetCommentsError(error.data as ApiErrorResponse);
    }

    throw new GetCommentsError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};