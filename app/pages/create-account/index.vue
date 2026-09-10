<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import CreateAccountForm from '~/components/customs/CreateAccountForm.vue';
import { createAccount, CreateAccountError } from '~/functions/create-account';

definePageMeta({
  layout: false,
});

useHead({
  title: 'Create Account - Bluecircle',
});

const router = useRouter();

const tokenCookie = useCookie('auth_token', {
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
  sameSite: 'strict',
});

const errorMessage = ref("");

const createAccountMutation = useMutation({
  mutationFn: createAccount,
  onSuccess: (response) => {
    errorMessage.value = "";
    tokenCookie.value = response.token;
    window.location.href = '/';
  },
  onError: (error) => {
    if (error instanceof CreateAccountError) {
      errorMessage.value = error.response.message;
      return;
    }
    errorMessage.value = "Something went wrong";
  },
});
</script>

<template>
  <div class="grid grid-cols-[40%_60%]">
    <div class="shrink-0 flex flex-col justify-center p-10 border-r border-gray-700">
      <div class="space-y-4">
        <h1 class="text-6xl font-bold text-right text-blue-500">
          Create Account
        </h1>
        <p class="text-right">
          We’re so excited to have you join us!
        </p>
      </div>
    </div>
    <main class="flex flex-col justify-center max-w-150 w-full min-h-screen p-10">
      <CreateAccountForm
        :isPending="createAccountMutation.isPending.value"
        :error-message="errorMessage"
        @back="router.back()"
        @create-account="createAccountMutation.mutate"
      />
    </main>
  </div>
</template>