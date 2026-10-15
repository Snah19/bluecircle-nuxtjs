// app/functions/get-user.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { User } from '@/types/user';
import type { PaginatedResponse } from '@/interfaces/paginated-response';

export class SearchUsersError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'SearchUsersError';
  }
}

type Payload = {
  query: string;
  page?: number;
  limit?: number;
};

export const searchUsers = async (payload: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<User>>('/api/v1/search/users', {
      query: {
        ...payload,
      }
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new SearchUsersError(error.data as ApiErrorResponse);
    }

    throw new SearchUsersError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};