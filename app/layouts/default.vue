<!-- app.layouts/default.vue -->

<script setup lang="ts">
import Leftbar from '~/components/layouts/Leftbar.vue';
import Rightbar from '~/components/layouts/Rightbar.vue';

</script>

<template>
  <div class="flex justify-between max-w-292.5 min-h-screen mx-auto">
    <Leftbar />

    <slot />

    <Rightbar />
  </div>
</template>