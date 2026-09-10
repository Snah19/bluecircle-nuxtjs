export const useApi = () => {
  const tokenCookie = useCookie('auth_token');

  return $fetch.create({
    baseURL: 'https://bluecircle-nestjs.onrender.com',
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