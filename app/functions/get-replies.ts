// app/functions/get-post-detail.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Comment } from '@/types/comment';

export class GetRepliesError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetRepliesError';
  }
}

type Payload = {
  commentId: string;
  page?: number;
  limit?: number;
};

export const getReplies = async ({ commentId, page = 1, limit = 5 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Comment>>(`api/v1/comments/${commentId}/replies`, {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetRepliesError(error.data as ApiErrorResponse);
    }

    throw new GetRepliesError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};