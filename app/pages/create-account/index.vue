<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import CreateAccountForm from '~/components/customs/CreateAccountForm.vue';
import { createAccount, CreateAccountError } from '~/functions/create-account';

definePageMeta({
  layout: false,
  middleware: 'redirect-if-authenticated',
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
  <div class="block min-[800px]:grid grid-cols-[40%_60%]">
    <div class="shrink-0 hidden min-[800px]:flex flex-col justify-center p-10 border-r border-gray-700">
      <div class="space-y-4">
        <h1 class="text-4xl font-bold text-right text-blue-500">
          Create Account
        </h1>
        <p class="text-right">
          We’re so excited to have you join us!
        </p>
      </div>
    </div>
    <main class="flex flex-col justify-center items-center gap-y-10 min-[800px]:items-start min-[800px]:max-w-150 w-full min-h-screen p-10">
      <div class="block min-[800px]:hidden space-y-4 text-center">
        <h1 class="text-4xl font-bold text-blue-500">
          Create Account
        </h1>
        <p>
          We’re so excited to have you join us!
        </p>
      </div> 
      <CreateAccountForm
        :isPending="createAccountMutation.isPending.value"
        :error-message="errorMessage"
        @back="router.back()"
        @create-account="createAccountMutation.mutate"
      />
    </main>
  </div>
</template>