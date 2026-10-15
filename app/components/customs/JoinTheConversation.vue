<script setup lang="ts">
import blueCircle from '~/assets/svgs/blue-circle.svg';
</script>

<template>
  <div class="hidden min-[1300px]:block space-y-2 p-4">
    <img
      :src="blueCircle"
      alt="bluecircle"
    />
    <h1 class="text-2xl font-bold leading-tight">
      Join the conversation
    </h1>

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
</template>