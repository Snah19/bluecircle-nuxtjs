export const useApi = () => {
  const tokenCookie = useCookie('auth_token');

  return $fetch.create({
    baseURL: import.meta.env.VITE_BLUECIRCLE_API_URL,
    onRequest({ options }) {
      if (tokenCookie.value) {
        const headers = new Headers(options.headers || {});
        headers.set('Authorization', `Bearer ${tokenCookie.value}`);
        options.headers = headers;
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        tokenCookie.value = null;
        navigateTo('/sign-in');
      }
    },
  });
};