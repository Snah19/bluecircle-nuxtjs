// app/functions/toggle-like.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class ToggleLikeError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ToggleLikeError';
  }
}

type Payload = {
  postId: string;
};

type Response = {
  isLiked: boolean;
  totalLikes: number;
};

export const toggleLike = async ({ postId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/posts/${postId}/likes`, {
      method: 'POST',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new ToggleLikeError(error.data as ApiErrorResponse);
    }

    throw new ToggleLikeError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};