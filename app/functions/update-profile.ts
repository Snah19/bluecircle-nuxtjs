// app/functions/update-post.ts

import type { ApiErrorResponse } from "@/interfaces/api-error-response";

type Payload = {
  fullname: string;
  bio?: string;
  profileImageFile?: File;
  coverImageFile?: File;
  removeProfileImage?: boolean;
  removeCoverImage?: boolean;
};

type Response = {
  message: string;
};

export class UpdateProfileError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = "UpdateProfileError";
  }
}

export const updateProfile = async ({
  fullname,
  bio,
  profileImageFile,
  coverImageFile,
  removeProfileImage,
  removeCoverImage,
}: Payload) => {
  const { $api } = useNuxtApp();

  try {
    let profileImageUrl: string | undefined | null = undefined;
    let coverImageUrl: string | undefined | null = undefined;

    if (removeProfileImage) {
      profileImageUrl = null;
    }
    else if (profileImageFile) {
      const formData = new FormData();
      formData.append('files', profileImageFile);

      const [url] = await $api<string>('/api/v1/upload-images', {
        method: 'POST',
        body: formData,
      });

      profileImageUrl = url;
    }
  
    if (removeCoverImage) {
      coverImageUrl = null;
    }
    else if (coverImageFile) {
      const formData = new FormData();
      formData.append('files', coverImageFile);

      const [url] = await $api<string>('/api/v1/upload-images', {
        method: 'POST',
        body: formData,
      });

      coverImageUrl = url;
    }

    return await $api<Response>('api/v1/users/profile', {
      method: 'PATCH',
      body: {
        fullname,
        bio,
        profileImageUrl,
        coverImageUrl,
      },
    });
  } catch (error: any) {
    if (error?.data) {
      throw new UpdateProfileError(error.data as ApiErrorResponse);
    }

    throw new UpdateProfileError({
      message: "Something went wrong",
      error: "Unknown",
      statusCode: error?.statusCode ?? 500,
    });
  }
};