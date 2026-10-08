// app/functions/toggle-follow.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class ToggleFollowError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ToggleFollowError';
  }
}

type Payload = {
  userId: string;
};

type Response = {
  isFollowing: boolean;
};

export const toggleFollow = async ({ userId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/follows/users/${userId}`, {
      method: 'POST',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new ToggleFollowError(error.data as ApiErrorResponse);
    }

    throw new ToggleFollowError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};