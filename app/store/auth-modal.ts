// app/stores/auth-modal.ts

export const useAuthModalStore = defineStore('auth-modal', () => {
  const isOpen = ref(false);

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return { isOpen, open, close };
});