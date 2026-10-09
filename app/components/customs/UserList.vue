<script setup lang="ts">
import type { User } from '@/types/user';
import defaultProfile from '@/assets/svgs/default-profile.svg';

interface Props {
  users: User[];
  isLoading?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'toggle-follow': [userId: string];
  loadMore: [];
  retry: [];
}>();

const sentinel = ref<HTMLElement | null>(null);

useInfiniteScroll(sentinel, {
  canLoadMore: () =>
    !props.isLoading && !!props.hasNextPage && !props.isFetchingNextPage,
  onLoadMore: () => emit('loadMore'),
  recheckOn: () => [props.users.length, props.isLoading],
});
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  
  <div
    v-for="user in users"
    class="flex gap-x-4 min-h-24.25 p-4 border-b border-gray-700 cursor-pointer"
  >
    <div class="shrink-0 size-10 border border-gray-500 rounded-full overflow-hidden">
      <img
        class="size-full object-cover"
        :src="user.profileImageUrl || defaultProfile"
        width="auto"
        height="auto"
        :alt="`${user.fullname}, ${user.username}`"
      />
    </div>
    <div class="flex-1 space-y-2">
      <div class="flex justify-between">
        <div class="text-xs">
          <p class="font-bold">
            {{ user.fullname }}
          </p>
          <p class="text-gray-400">
            @{{ user.username }}
          </p>
        </div>

        <button
          :class="cn(
            'py-2 px-4 text-sm rounded-full cursor-pointer capitalize bg-gray-800 hover:bg-gray-700',
            (
              user.viewer.relationshipStatus === 'follow' ||
              user.viewer.relationshipStatus === 'follow back'
            ) && 'bg-blue-500 hover:bg-blue-600',
          )"
          @click="emit('toggle-follow', user.id)"
        >
          {{ user.viewer.relationshipStatus }}
        </button>
      </div>
      <p class="text-sm line-clamp-1">
        {{ user.bio }}
      </p>
    </div>
  </div>

  <div ref="sentinel" class="h-px" />

  <LoadingSpinner v-if="isFetchingNextPage && !isLoading" />
</template>