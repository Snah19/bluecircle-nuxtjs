// app/functions/get-notifications.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { PaginatedResponse } from '@/interfaces/paginated-response';
import type { Notification } from '@/types/notification';

export class GetNotificationsError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetNotificationsError';
  }
}

type Payload = {
  page?: number;
  limit?: number;
};

export const getNotifications = async ({ page = 1, limit = 15 }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<PaginatedResponse<Notification>>('/api/v1/notifications', {
      query: { page, limit },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetNotificationsError(error.data as ApiErrorResponse);
    }

    throw new GetNotificationsError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};