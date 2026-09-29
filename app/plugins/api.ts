export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: import.meta.env.VITE_BLUECIRCLE_API_URL,
    onRequest({ options }) {
      const tokenCookie = useCookie<string | null>('auth_token');
      if (tokenCookie.value) {
        options.headers.set('Authorization', `Bearer ${tokenCookie.value}`);
      }
    },
  });

  return {
    provide: { api },
  };
});