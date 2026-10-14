<script setup lang="ts">
import type { Notification } from '@/types/notification';
import { formatRelativeTime } from '~/lib/format-relative-time';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import LoadingSpinner from '@/components/customs/LoadingSpinner.vue';

interface Props {
  notifications: Notification[];
  isLoading?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'mark-notification-as-read': [notificationId: string];
  'load-more': [];
  'retry': [];
}>();

const sentinel = ref<HTMLElement | null>(null);

useInfiniteScroll(sentinel, {
  canLoadMore: () =>
    !props.isLoading && !!props.hasNextPage && !props.isFetchingNextPage,
  onLoadMore: () => emit('load-more'),
  recheckOn: () => [props.notifications.length, props.isLoading],
});
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  
  <div
    v-for="n in notifications"
    :key="n.id"
    :class="cn(
      'flex gap-x-4 py-2 px-4 border-b border-gray-700 cursor-pointer',
      !n.read && 'bg-blue-500/5'
    )"
    @click="() => {
      emit('mark-notification-as-read', n.id);

      if (n.type === 'follow') {
        navigateTo(`/profile/${n.fromUser.username}`);
      }
      else {
        navigateTo(`/post/${n.post.id}`);
      }
    }"
  >
    <NuxtLink
      class="shrink-0 block size-10 border border-gray-500 rounded-full overflow-hidden"
      :href="`/profile/${n.fromUser.username}`"
    >
      <img
        class="size-full object-cover"
        :src="n.fromUser.profileImageUrl || defaultProfile"
        width="auto"
        height="auto"
        :alt="n.fromUser.fullname"
      />
    </NuxtLink>

    <div class="flex-1 space-y-2">
      <div class="text-xs">
        <NuxtLink
          class="text-gray-400 hover:underline"
          :href="`/profile/${n.fromUser.username}`"
        >
          @{{ n.fromUser.username }}
        </NuxtLink>
          &bull; 
        <span class="text-gray-400">
          {{ formatRelativeTime(new Date(n.createdAt)) }}
        </span>
      </div>

      <div
        v-if="n.type === 'reply' && n.comment"
        class="space-y-2"
      >
        <div class="flex items-center gap-x-2 text-xs text-gray-400">
          <Icon name="lucide:corner-down-right" class="shrink-0 size-4 text-white" />
          <p class="line-clamp-1">
            replied to your comment
          </p>
        </div>
        <p class="text-sm">{{ n.comment.text }}</p>      
      </div>

      <div
        v-if="n.type === 'comment' && n.comment"
        class="space-y-2"
      >
        <div
          v-if="n.repliedToUser"
          class="flex items-center gap-x-2 text-xs text-gray-400"
        >
          <Icon name="lucide:corner-down-right" class="shrink-0 size-4 text-white" />
          <p class="line-clamp-1">
            replied to @{{ n.repliedToUser.username }}
          </p>
        </div>

        <div
          v-else
          class="flex items-center gap-x-2 text-xs text-gray-400"
        >
          <Icon name="lucide:message-circle" class="shrink-0 size-4 text-white" />
          <p
            class="line-clamp-1"
          >
            commented on your post: {{ n.post.text }}
          </p>
        </div>
        <p class="text-sm">{{ n.comment.text }}</p>
      </div>

      <div
        v-if="n.type === 'follow'"
        class="flex items-center gap-x-2 text-xs text-gray-400"
      >
        <Icon
          name="lucide:user-round-plus"
          class="size-5 text-blue-500"
        />
        followed you
      </div>

      <div
        v-if="n.type === 'like'"
        class="flex items-center gap-x-2 text-xs text-gray-400"
      >
        <Icon
          name="lucide:heart"
          class="shrink-0 size-4 text-red-500"
        />
        <p
          v-if="n.comment"
          class="line-clamp-1"
        >
          liked your comment: {{ n.comment.text }}
        </p>
        <p
          v-else
          class="line-clamp-1"
        >
          liked your post: {{ n.post.text }}
        </p>
      </div>

      <div
        v-if="n.type === 'repost'"
        class="flex items-center gap-x-2 text-xs text-gray-400"
      >
        <Icon
          name="lucide:repeat-2"
          class="shrink-0 size-5 text-green-500"
        />
        <p class="line-clamp-1">
          reposted your post: {{ n.post.text }}
        </p>
      </div>
    </div>
  </div>

  <div ref="sentinel" class="h-px" />

  <LoadingSpinner v-if="isFetchingNextPage && !isLoading" />
</template>