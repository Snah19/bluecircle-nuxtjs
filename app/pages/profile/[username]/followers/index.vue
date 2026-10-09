<!-- app/pages/profile/[username]/followers -->

<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { userQuery } from '@/queries/user.query';
import { toggleFollow } from '@/functions/toggle-follow';
import UserList from '~/components/customs/UserList.vue';
import { followersInfiniteQuery } from '@/queries/followers.infinite-query';

const route = useRoute();
const router = useRouter();
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

const followers = useInfiniteQuery(
  followersInfiniteQuery(username.value),
);

const users = computed(() => followers.data.value?.pages.flatMap((page) => page.data) ?? []);

const loadMore = () => {
  if (followers.hasNextPage.value && !followers.isFetchingNextPage.value) {
    followers.fetchNextPage();
  }
};

const retry = () => followers.refetch();

const toggleFollowMutation = useMutation({
  mutationFn: toggleFollow,
  onSuccess: (data) => {
    console.log(data);
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [username.value, 'followers'] }),
      queryClient.invalidateQueries({ queryKey: ['users', username.value] }),
    ]);
  },
  onError: (error) => {
    console.error(error);
  },
});

const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  }
  else {
    navigateTo('/');
  }
};

useHead({
  title: () => `People followed by @${username.value} - Bluecircle`,
});
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

      <div class="absolute left-16">
        <h1 class="font-bold">
          {{ `@${user?.username}` }}
        </h1>
        <p class="text-xs">
          {{ user?.meta.totalFollowers }} {{ user?.meta.totalFollowers === 1 ? 'follower' : 'followers' }}
        </p>
      </div>
    </div>
    
    <UserList
      :users
      :isLoading="followers.isLoading.value"
      :isError="followers.isError.value"
      :hasNextPage="followers.hasNextPage.value"
      :isFetchingNextPage=" followers.isFetchingNextPage.value || followers.isFetchingNextPage.value"
      @load-more="loadMore"
      @retry="retry"
      @toggle-follow="(userId) => toggleFollowMutation.mutate({ userId })"
    />
  </main>
</template>