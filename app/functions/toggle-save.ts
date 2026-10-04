// app/functions/toggle-save.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class ToggleSaveError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ToggleSaveError';
  }
}

type Payload = {
  postId: string;
};

type Response = {
  isSaved: boolean;
  totalSaves: number;
};

export const toggleSave = async ({ postId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/posts/${postId}/saves`, {
      method: 'POST',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new ToggleSaveError(error.data as ApiErrorResponse);
    }

    throw new ToggleSaveError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};