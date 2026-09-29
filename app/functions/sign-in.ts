import type { ApiErrorResponse } from "~/interfaces/api-error-response";
import type { User } from "~/types/user";

interface Response {
  token: string;
  user: User;
}

type Payload = {
  email: string;
  password: string;
}

export class SignInError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = "SignInError";
  }
}

export const signIn = async (payload: Payload): Promise<Response> => {
  const { $api } = useNuxtApp();

  try {
    return await $api<Response>('/api/v1/auth/sign-in', {
      method: 'POST',
      body: payload,
    });
  }
  catch (error: any) {
    if (error?.data) {
      throw new SignInError(error.data as ApiErrorResponse);
    }

    throw new SignInError({
      message: "Something went wrong",
      error: "Unknown",
      statusCode: error?.statusCode ?? 500,
    });
  }
};