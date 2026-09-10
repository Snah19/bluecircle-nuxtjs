<script setup lang="ts">
import blueCircle from '~/assets/svgs/blue-circle.svg';
</script>

<template>
  <div class="space-y-2">
    <img
      :src="blueCircle"
      alt="bluecircle"
    />
    <h1 class="text-2xl font-bold leading-tight">
      Join the conversation
    </h1>

    <div class="flex gap-x-2 text-xs">
      <button class="py-2 px-4 rounded-full cursor-pointer bg-blue-700 hover:bg-blue-600">
        Create account
      </button>
      <button
        class="py-2 px-4 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700"
        @click="navigateTo('/sign-in')"
      >
        Sign in
      </button>
    </div>
  </div>
</template>