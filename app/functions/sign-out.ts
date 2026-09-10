import type { ApiErrorResponse } from "~/interfaces/api-error-response";

export class SignOutError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = "SignOutError";
  }
}

export const signOut = async (token: string) => {
  try {
    return await $fetch(
      `${import.meta.env.VITE_BLUECIRCLE_API_URL}/api/v1/auth/sign-out`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  catch (error: any) {
    if (error?.data) {
      throw new SignOutError(error.data as ApiErrorResponse);
    }

    throw new SignOutError({
      message: "Something went wrong",
      error: "Unknown",
      statusCode: error?.statusCode ?? 500,
    });
  }
};