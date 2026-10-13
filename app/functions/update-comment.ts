// app/functions/update-post.ts

import type { ApiErrorResponse } from "@/interfaces/api-error-response";
import type { Comment } from "~/types/comment";

type Payload = {
  commentId: string;
  text: string;
};

export class UpdateCommentError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = "UpdateCommentError";
  }
}

export const updateComment = async ({
  commentId,
  text,
}: Payload) => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Comment>(`api/v1/comments/${commentId}`, {
      method: 'PATCH',
      body: {
        text,
      },
    });
  } catch (error: any) {
    if (error?.data) {
      throw new UpdateCommentError(error.data as ApiErrorResponse);
    }

    throw new UpdateCommentError({
      message: "Something went wrong",
      error: "Unknown",
      statusCode: error?.statusCode ?? 500,
    });
  }
};