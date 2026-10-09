<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { userQuery } from '@/queries/user.query';
import { followingsInfiniteQuery } from '~/queries/followings.infinite-query';
import { toggleFollow } from '@/functions/toggle-follow';
import UserList from '~/components/customs/UserList.vue';

const route = useRoute();
const username = computed(() => route.params.username as string);
const queryClient = useQueryClient();

if (import.meta.server) {
  await queryClient
    .query(userQuery(username.value))
    .catch(() => {});
}

const { data: user } = useQuery(
  computed(() => userQuery(username.value)),
);

const followings = useInfiniteQuery(
  followingsInfiniteQuery(username.value),
);

const users = computed(() => followings.data.value?.pages.flatMap((page) => page.data) ?? []);

const loadMore = () => {
  if (followings.hasNextPage.value && !followings.isFetchingNextPage.value) {
    followings.fetchNextPage();
  }
};

const retry = () => followings.refetch();

const toggleFollowMutation = useMutation({
  mutationFn: toggleFollow,
  onSuccess: (data) => {
    console.log(data);
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [username.value, 'followings'] }),
      queryClient.invalidateQueries({ queryKey: ['users', username.value] }),
    ]);
  },
  onError: (error) => {
    console.error(error);
  },
});

useHead({
  title: () => `People followed by @${username.value} - Bluecircle`,
});
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="z-50 sticky top-0 flex items-center gap-x-4 p-4 border-b border-gray-700 bg-gray-900">
      <button class="flex justify-center items-center size-8 rounded-full cursor-pointer bg-gray-900 hover:bg-gray-700">
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>

      <div class="absolute left-16">
        <h1 class="font-bold">
          {{ `@${user?.username}` }}
        </h1>
        <p class="text-xs">
          {{ user?.meta.totalFollowing }} following
        </p>
      </div>
    </div>
    
    <UserList
      :users
      :isLoading="followings.isLoading.value"
      :isError="followings.isError.value"
      :hasNextPage="followings.hasNextPage.value"
      :isFetchingNextPage=" followings.isFetchingNextPage.value || followings.isFetchingNextPage.value"
      @load-more="loadMore"
      @retry="retry"
      @toggle-follow="(userId) => toggleFollowMutation.mutate({ userId })"
    />
  </main>
</template>