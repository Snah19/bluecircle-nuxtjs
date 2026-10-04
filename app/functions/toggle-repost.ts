// app/functions/toggle-repost.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class ToggleRepostError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ToggleRepostError';
  }
}

type Payload = {
  postId: string;
};

type Response = {
  isReposted: boolean;
  totalReposts: number;
};

export const toggleRepost = async ({ postId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/posts/${postId}/reposts`, {
      method: 'POST',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new ToggleRepostError(error.data as ApiErrorResponse);
    }

    throw new ToggleRepostError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};