// app/functions/get-user.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { User } from '@/types/user';

export class GetUserError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetUserError';
  }
}

type Payload = {
  username: string;
};

export const getUser = async ({ username }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<User>(`/api/v1/users/${username}`);
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetUserError(error.data as ApiErrorResponse);
    }

    throw new GetUserError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};