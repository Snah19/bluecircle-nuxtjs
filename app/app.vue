<!-- app/app.vue -->

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { meQuery } from '~/queries/me.query';
import { unreadNotificationsQuery } from './queries/unread-notifications.query';

const me = useQuery(meQuery());
const unreadNotifications = useQuery(unreadNotificationsQuery());

onServerPrefetch(async () => {
  await me.suspense().catch(() => {});
  await unreadNotifications.suspense().catch(() => {});
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>