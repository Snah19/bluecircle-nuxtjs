// app/functions/update-post.ts

import type { ApiErrorResponse } from "@/interfaces/api-error-response";
import type { Post } from "@/types/post";

type Payload = {
  postId: string;
  text?: string;
  keptImageUrls: string[];
  files?: File[];
};

export class UpdatePostError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = "UpdatePostError";
  }
}

export const updatePost = async ({
  postId,
  text,
  keptImageUrls,
  files,
}: Payload) => {
  const { $api } = useNuxtApp();

  try {
    let uploadedImageUrls: string[] = [];

    if (files?.length) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      uploadedImageUrls = await $api<string[]>('/api/v1/upload-images', {
        method: 'POST',
        body: formData,
      });
    }

    return await $api<Post>(`/api/v1/posts/${postId}`, {
      method: 'PATCH',
      body: {
        text,
        imageUrls: [...keptImageUrls, ...uploadedImageUrls],
      },
    });
  } catch (error: any) {
    if (error?.data) {
      throw new UpdatePostError(error.data as ApiErrorResponse);
    }

    throw new UpdatePostError({
      message: "Something went wrong",
      error: "Unknown",
      statusCode: error?.statusCode ?? 500,
    });
  }
};