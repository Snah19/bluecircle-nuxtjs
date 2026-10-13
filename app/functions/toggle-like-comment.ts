// app/functions/toggle-like.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class ToggleLikeCommentError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ToggleLikeCommentError';
  }
}

type Payload = {
  commentId: string;
};

type Response = {
  isLiked: boolean;
  totalLikes: number;
};

export const toggleLikeComment = async ({ commentId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/comments/${commentId}/likes`, {
      method: 'POST',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new ToggleLikeCommentError(error.data as ApiErrorResponse);
    }

    throw new ToggleLikeCommentError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};