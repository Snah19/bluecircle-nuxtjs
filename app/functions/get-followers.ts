// app/functions/get-following-posts.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { User } from '~/types/user';

export class GetFollowersError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetFollowersError';
  }
}

type Payload = {
  username: string;
  page?: number;
  limit?: number;
};

export const getFollowers = async ({ username, page = 1, limit = 15 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<User>>(`api/v1/users/${username}/followers`, {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetFollowersError(error.data as ApiErrorResponse);
    }

    throw new GetFollowersError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};