<!-- app/pages/notifications/index.vue -->

<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { notificationsInfiniteQuery } from '@/queries/notifications.infinite-query';
import { markNotificationAsRead } from '@/functions/mark-notification-as-read';
import NotificationList from '~/components/customs/NotificationList.vue';

const router = useRouter();
const queryClient = useQueryClient();

const notificationsQuery = useInfiniteQuery(
  notificationsInfiniteQuery(),
);

const notifications = computed(() => notificationsQuery.data.value?.pages.flatMap((page) => page.data) ?? []);

const markNotificationAsReadMutation = useMutation({
  mutationFn: markNotificationAsRead,
  onSuccess: (data) => {
    console.log(data);
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    ]);
  },
  onError: (error) => {
    console.error(error);
  }
});

const loadMore = () => {
  if (notificationsQuery.hasNextPage.value && !notificationsQuery.isFetchingNextPage.value) {
    notificationsQuery.fetchNextPage();
  }
};

const retry = () => notificationsQuery.refetch();

const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  }
  else {
    navigateTo('/');
  }
};

useHead({
  title: 'Notifications - Bluecircle'
})
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="z-50 sticky top-0 flex items-center gap-x-4 p-4 border-b border-gray-700 bg-gray-900">
      <button
        class="flex justify-center items-center size-8 rounded-full cursor-pointer bg-gray-900 hover:bg-gray-700"
        @click="goBack"
      >
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>

      <h1 class="text-xl font-bold">Notifications</h1>
    </div>

    <NotificationList
      :notifications
      :is-loading="notificationsQuery.isLoading.value"
      :is-error="notificationsQuery.isError.value"
      :hasNextPage="notificationsQuery.hasNextPage.value"
      @load-more="loadMore"
      @retry="retry"
      @mark-notification-as-read="(notificationId) => {
        markNotificationAsReadMutation.mutate({
          notificationId,
        });
      }"
    />
  </main>
</template>