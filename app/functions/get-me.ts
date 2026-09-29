// app/functions/get-me.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { User } from '@/types/user';

export class GetMeError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetMeError';
  }
}

export const getMe = async () => {
  const { $api } = useNuxtApp();

  try {
    return await $api<User>('/api/v1/me');
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetMeError(error.data as ApiErrorResponse);
    }

    throw new GetMeError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};