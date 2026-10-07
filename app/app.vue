<!-- app/app.vue -->

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { meQuery } from '~/queries/me.query';

const { suspense } = useQuery(meQuery());

onServerPrefetch(async () => {
  await suspense().catch(() => {});
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>