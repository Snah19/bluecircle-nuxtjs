import type { ApiErrorResponse } from "~/interfaces/api-error-response";
import type { User } from "~/types/user";

interface Response {
  token: string;
  user: User;
}

type Payload = {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export class CreateAccountError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = "CreateAccountError";
  }
}

export const createAccount = async (payload: Payload): Promise<Response> => {
  try {
    await $fetch<Response>(
      `${import.meta.env.VITE_BLUECIRCLE_API_URL}/api/v1/auth/create-account`,
      {
        method: 'POST',
        body: payload,
      },
    );

    const { username, ...body } = payload;

    return await $fetch<Response>(
      `${import.meta.env.VITE_BLUECIRCLE_API_URL}/api/v1/auth/sign-in`,
      {
        method: 'POST',
        body,
      },
    );
  }
  catch (error: any) {
    if (error?.data) {
      throw new CreateAccountError(error.data as ApiErrorResponse);
    }

    throw new CreateAccountError({
      message: "Something went wrong",
      error: "Unknown",
      statusCode: error?.statusCode ?? 500,
    });
  }
}