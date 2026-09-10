<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import SignInForm from '~/components/customs/SignInForm.vue';
import { signInUser, SignInError } from '~/functions/sign-in';

definePageMeta({
  layout: false,
});

useHead({
  title: 'Sign in - Bluecircle',
});

const router = useRouter();

const tokenCookie = useCookie('auth_token', {
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
  sameSite: 'strict',
});

const errorMessage = ref("");

const signInMutation = useMutation({
  mutationFn: signInUser,
  onSuccess: (response) => {
    errorMessage.value = "";
    tokenCookie.value = response.token;
    window.location.href = '/';
  },
  onError: (error) => {
    if (error instanceof SignInError) {
      errorMessage.value = error.response.message;
      return;
    }
    errorMessage.value = "Something went wrong while signing in. Please try again.";
  },
});
</script>

<template>
  <div class="flex justify-between max-w-225 mx-auto">
    <div class="shrink-0 flex flex-col justify-center p-10 border-r border-gray-800">
      <div class="space-y-4">
        <h1 class="text-6xl font-bold text-right text-blue-500">
          Sign in
        </h1>
        <p class="text-right">
          Enter your email and password
        </p>
      </div>
    </div>
    <main class="flex flex-col justify-center w-full min-h-screen p-10">
      <SignInForm
        :isPending="signInMutation.isPending.value"
        :error-message="errorMessage"
        @back="router.back()"
        @sign-in="signInMutation.mutate"
      />
    </main>
  </div>
</template>