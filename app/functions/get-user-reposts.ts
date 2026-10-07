// app/functions/get-user-reposts.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Post } from '@/types/post';

export class GetUserReposts extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetUserReposts';
  }
}

type Payload = {
  username: string;
  page?: number;
  limit?: number;
};

export const getUserReposts = async ({ username, page = 1, limit = 15 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Post>>(`/api/v1/users/${username}/reposts`, {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetUserReposts(error.data as ApiErrorResponse);
    }

    throw new GetUserReposts({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};