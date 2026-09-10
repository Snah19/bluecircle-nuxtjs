import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '~/interfaces/api-error-response';
import type { User } from '~/types/user';

export class GetMeError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetMeError';
  }
}

export const getMe = async (token: string) => {
  try {
    return await $fetch<User>(
      `${import.meta.env.VITE_BLUECIRCLE_API_URL}/api/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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