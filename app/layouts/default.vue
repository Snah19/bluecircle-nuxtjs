<!-- app/layouts/default.vue -->

<script setup lang="ts">
import Leftbar from '@/components/layouts/Leftbar.vue';
import Rightbar from '@/components/layouts/Rightbar.vue';
import AuthModal from '@/components/customs/AuthModal.vue';
import blueCircle from '@/assets/svgs/blue-circle.svg';
import { useQuery } from '@tanstack/vue-query';
import { meQuery } from '@/queries/me.query';
import Bottombar from '@/components/layouts/Bottombar.vue';

const { data: me } = useQuery(
  computed(() => meQuery())
);

</script>

<template>
  <div class="bg-gray-900">
    <div class="flex justify-center min-[1100]:justify-between max-w-292.5 min-h-screen mx-auto">
      <Leftbar />

      <div class="w-full min-[800px]:w-150 border-r border-gray-700 min-[1100px]:border-none">
        <slot />
      </div>

      <Rightbar />
    </div>

    <AuthModal />

    <Bottombar />
    <div
      v-if="!me"
      class="z-50 fixed bottom-0 flex justify-between items-center min-[1300px]:hidden w-full py-2 px-4 border-t border-gray-700 bg-gray-900"
    >
      <div class="flex justify-center items-center gap-x-2">
        <img
          class="size-6"
          :src="blueCircle"
          alt="bluecircle"
        />
        <p class="text-lg font-bold">
          Bluecircle
        </p>
      </div>

      <div class="flex gap-x-2 text-xs">
        <NuxtLink
          class="py-2 px-4 rounded-full cursor-pointer bg-blue-700 hover:bg-blue-600"
          to="/create-account"
        >
          Create account
        </NuxtLink>
        <NuxtLink
          class="py-2 px-4 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700"
          to="/sign-in"
        >
          Sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>