<!-- app/components/customs/AuthModal.vue -->

<script setup lang="ts">
import blueCircle from '~/assets/svgs/blue-circle.svg';
import { useAuthModalStore } from '@/store/auth-modal';

const authModal = useAuthModalStore();

const open = computed({
  get: () => authModal.isOpen,
  set: (value: boolean) => (value ? authModal.open() : authModal.close()),
});
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content: 'max-w-xs rounded-4xl ring ring-gray-700 bg-gray-900',
      overlay: 'bg-black/70'
    }"
  >
    <template #content>
      <div class="p-6 space-y-4">
        <div class="flex justify-end">
          <button
            class="cursor-pointer text-gray-400 hover:text-white"
            aria-label="Close"
            @click="authModal.close()"
          >
            <Icon name="lucide:x" />
          </button>
        </div>
        <div class="flex justify-center gap-x-2">
          <img
            :src="blueCircle"
            alt="bluecircle"
          />
          <p class="text-4xl font-bold">
            Bluecircle
          </p>
        </div>
        <p class="text-sm text-center">
          Sign in or create your account to join the conversation!
        </p>

        <div class="flex flex-col gap-y-2">
          <NuxtLink
            to="/create-account"
            class="py-2 text-center rounded-full cursor-pointer bg-blue-700 hover:bg-blue-600"
            @click="authModal.close()"
          >
            Create account
          </NuxtLink>

          <NuxtLink
            to="/sign-in"
            class="py-2 text-center rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700"
            @click="authModal.close()"
          >
            Sign in
          </NuxtLink>
        </div>
      </div>
    </template>
  </UModal>
</template>