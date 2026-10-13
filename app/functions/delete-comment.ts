// app/functions/delete-comment.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class DeleteCommentError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'DeleteCommentError';
  }
}

type Payload = {
  commentId: string;
};

type Response = {
  message: string;
};

export const deleteComment = async ({ commentId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/comments/${commentId}`, {
      method: 'DELETE',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new DeleteCommentError(error.data as ApiErrorResponse);
    }

    throw new DeleteCommentError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};