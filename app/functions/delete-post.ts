// app/functions/delete-post.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';

export class DeletePostError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'DeletePostError';
  }
}

type Payload = {
  postId: string;
};

type Response = {
  message: string;
};

export const deletePost = async ({ postId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>(`api/v1/posts/${postId}`, {
      method: 'DELETE',
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new DeletePostError(error.data as ApiErrorResponse);
    }

    throw new DeletePostError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};