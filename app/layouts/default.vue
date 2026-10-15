<!-- app/layouts/default.vue -->

<script setup lang="ts">
import Leftbar from '@/components/layouts/Leftbar.vue';
import Rightbar from '@/components/layouts/Rightbar.vue';
import AuthModal from '~/components/customs/AuthModal.vue';
</script>

<template>
  <div class="bg-gray-900">
    <div class="flex justify-between max-w-292.5 min-h-screen mx-auto">
      <Leftbar />

      <slot />

      <Rightbar />
    </div>

    <AuthModal />
  </div>
</template>