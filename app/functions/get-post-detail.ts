// app/functions/get-post-detail.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from '@/interfaces/api-error-response';
import type { Post } from '@/types/post';

export class GetPostDetailError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'GetPostDetailError';
  }
}

type Payload = {
  postId: string;
};

export const getPostDetail = async ({ postId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Post>(`api/v1/posts/${postId}`);
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new GetPostDetailError(error.data as ApiErrorResponse);
    }

    throw new GetPostDetailError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};