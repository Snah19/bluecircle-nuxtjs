// app/composables/useSearchTerm.ts

export const useSearchTerm = () => {
  const route = useRoute();

  return computed(() => {
    const raw = route.query.query;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value?.trim() ?? '';
  });
};