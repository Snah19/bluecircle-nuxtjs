// app/functions/create-post.ts

import type { ApiErrorResponse } from "@/interfaces/api-error-response";
import type { Post } from "@/types/post";

type Payload = {
  text?: string;
  files?: File[];
};

export class CreatePostError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = "CreatePostError";
  }
}

export const createPost = async (payload: Payload): Promise<Post> => {
  const { $api } = useNuxtApp();

  try {
    let imageUrls: string[] = [];

    if (payload.files?.length) {
      const formData = new FormData();
      payload.files.forEach((file) => {
        formData.append('files', file);
      });

      imageUrls = await $api<string[]>('/api/v1/upload-images', {
        method: 'POST',
        body: formData,
      });
    }

    return await $api<Post>('/api/v1/posts', {
      method: 'POST',
      body: {
        ...(payload.text ? { text: payload.text } : {}),
        imageUrls,
      },
    });
  }
  catch (error: any) {
    if (error?.data) {
      throw new CreatePostError(error.data as ApiErrorResponse);
    }

    throw new CreatePostError({
      message: "Something went wrong",
      error: "Unknown",
      statusCode: error?.statusCode ?? 500,
    });
  }
}