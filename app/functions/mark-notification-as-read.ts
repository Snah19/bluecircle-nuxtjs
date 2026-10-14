// app/functions/mark-notification-as-read.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class MarkNotificationAsReadError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'MarkNotificationAsReadError';
  }
}

type Payload = {
  notificationId: string;
};

type Response = {
  message: string;
};

export const markNotificationAsRead = async ({ notificationId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new MarkNotificationAsReadError(error.data as ApiErrorResponse);
    }

    throw new MarkNotificationAsReadError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};