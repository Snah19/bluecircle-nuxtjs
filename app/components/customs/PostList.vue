<!-- app/components/customs/PostList.vue -->

<script setup lang="ts">
import type { Post } from '@/types/post';
import PostCard from '@/components/customs/PostCard.vue';
import LoadingSpinner from '@/components/customs/LoadingSpinner.vue';

interface Props {
  posts: Post[];
  isLoading?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  toggleRepost: [postId: string];
  toggleLike: [postId: string];
  toggleSave: [postId: string];
  openLightbox: [payload: { imageUrls: string[]; index: number }];
  openCommentModal: [post: Post];
  openUpdatePostModal: [post: Post];
  openDeletePostModal: [post: Post];
  loadMore: [];
  retry: [];
}>();

const sentinel = ref<HTMLElement | null>(null);

useInfiniteScroll(sentinel, {
  canLoadMore: () =>
    !props.isLoading && !!props.hasNextPage && !props.isFetchingNextPage,
  onLoadMore: () => emit('loadMore'),
  recheckOn: () => [props.posts.length, props.isLoading],
});
</script>

<template>
  <div>
    <!-- First load -->
    <LoadingSpinner v-if="isLoading" />

    <!-- Error on first load -->
    <div
      v-else-if="isError && posts.length === 0"
      class="flex flex-col items-center gap-y-3 p-8"
    >
      <p class="text-sm text-gray-400">Couldn't load posts.</p>
      <UButton label="Try again" variant="outline" @click="emit('retry')" />
    </div>

    <!-- Empty -->
    <p
      v-else-if="posts.length === 0"
      class="p-8 text-center text-sm text-gray-400"
    >
      No posts yet.
    </p>

    <!-- Loaded -->
    <template v-else>
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post
        @toggle-repost="emit('toggleRepost', $event)"
        @toggle-like="emit('toggleLike', $event)"
        @toggle-save="emit('toggleSave', $event)"
        @open-lightbox="emit('openLightbox', $event)"
        @open-comment-modal="emit('openCommentModal', $event)"
        @open-update-post-modal="emit('openUpdatePostModal', $event)"
        @open-delete-post-modal="emit('openDeletePostModal', $event)"
      />
    </template>

    <div ref="sentinel" class="h-px" />

    <LoadingSpinner v-if="isFetchingNextPage && !isLoading" />
  </div>
</template>