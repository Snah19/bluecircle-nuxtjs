// app/functions/create-comment.ts

import { FetchError } from 'ofetch';
import type { ApiErrorResponse } from "@/interfaces/api-error-response";
import type { Comment } from '@/types/comment';

export class CreateCommentError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'CreateCommentError';
  }
}

type Payload = {
  postId: string;
  text: string;
  parentId?: string;
};

export const createComment = async ({ postId, text, parentId }: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Comment>(`api/v1/comments/posts/${postId}`, {
      method: 'POST',
      body: {
        text,
        parentId,
      },
    });
  }
  catch (error) {
    if (error instanceof FetchError && error.data) {
      throw new CreateCommentError(error.data as ApiErrorResponse);
    }

    throw new CreateCommentError({
      message: 'Something went wrong',
      error: 'Unknown',
      statusCode: (error as FetchError)?.statusCode ?? 500,
    });
  }
};