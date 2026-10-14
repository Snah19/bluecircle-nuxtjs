// app/functions/get-unread-notifications.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class GetUnreadNotificationsError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetUnreadNotificationsError';
  }
}

type Response = {
  total: number;
};

export const getUnreadNotifications = async () => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>('/api/v1/notifications/unread');
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetUnreadNotificationsError(error.data as ApiErrorResponse);
    }

    throw new GetUnreadNotificationsError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};