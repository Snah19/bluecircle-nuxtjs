<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { savedPostsInfiniteQuery } from '~/queries/saved-posts.infinite-query';
import PostList from '@/components/customs/PostList.vue';
import { toggleLike } from '@/functions/toggle-like';
import { toggleRepost } from '@/functions/toggle-repost';
import { toggleSave } from '@/functions/toggle-save';
import ImageLightbox from '@/components/customs/ImageLightbox.vue';
import CreateCommentModal from '@/components/customs/CreateCommentModal.vue';
import UpdatePostModal from '@/components/customs/UpdatePostModal.vue';
import type { Post } from '@/types/post';
import { createComment } from '@/functions/create-comment';
import { meQuery } from '@/queries/me.query';
import { updatePost } from '@/functions/update-post';
import { deletePost } from '@/functions/delete-post';
import ConfirmModal from "@/components/customs/ConfirmModal.vue";

type Modal = 'create-comment' | 'update-post' | 'delete-post' | null;

useHead({
  title: 'Saved - Bluecircle'
});

const queryClient = useQueryClient();
const lightbox = ref<{ imageUrls: string[]; index: number } | null>(null);
const isLightboxOpen = ref(false);
const openLightbox = (payload: { imageUrls: string[]; index: number }) => {
  lightbox.value = payload;
  isLightboxOpen.value = true;
};
const activeModal = ref<Modal>(null);
const previewPost = ref<Post | null>(null);

const { data: me } = useQuery(meQuery());
const savedPosts = useInfiniteQuery(
  savedPostsInfiniteQuery(),
);

const loadMore = () => {
  if (savedPosts.hasNextPage.value && !savedPosts.isFetchingNextPage.value) {
    savedPosts.fetchNextPage();
  }
};

const retry = () => savedPosts.refetch();

const posts = computed(() => savedPosts.data.value?.pages.flatMap((page) => page.data) ?? []);

const toggleLikeMutation = useMutation({
  mutationFn: toggleLike,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['users', 'saved-posts'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleRepostMutation = useMutation({
  mutationFn: toggleRepost,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['users', 'saved-posts'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleSaveMutation = useMutation({
  mutationFn: toggleSave,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['users', 'saved-posts'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const createCommentMutation = useMutation({
  mutationFn: createComment,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['users', 'saved-posts'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const updatePostMutation = useMutation({
  mutationFn: updatePost,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['users', 'saved-posts'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const deletePostMutation = useMutation({
  mutationFn: deletePost,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['users', 'saved-posts'] });
  },
  onError: (error) => {
    console.error(error);
  },
});
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="z-50 sticky top-0 flex items-center gap-x-4 p-4 border-b border-gray-700 bg-gray-900">
      <button class="flex justify-center items-center size-8 rounded-full cursor-pointer bg-gray-900 hover:bg-gray-700">
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>

      <h1 class="text-xl font-bold">Save Posts</h1>
    </div>

    <PostList
      :posts
      :is-loading="savedPosts.isLoading.value"
      :is-error="savedPosts.isError.value"
      :has-next-page="savedPosts.hasNextPage.value"
      :is-fetching-next-page="savedPosts.isFetchingNextPage.value || savedPosts.isFetchNextPageError.value"
      @load-more="loadMore"
      @retry="retry"
      @toggle-repost="(postId) => toggleRepostMutation.mutate({ postId })"
      @toggle-like="(postId) => toggleLikeMutation.mutate({ postId })"
      @toggle-save="(postId) => toggleSaveMutation.mutate({ postId })"
      @open-lightbox="openLightbox"
      @open-comment-modal="(p) => {
        previewPost = p;
        activeModal = 'create-comment';
      }"
      @open-delete-post-modal="(p) => {
        previewPost = p;
        activeModal = 'delete-post';
      }"
      @open-update-post-modal="(p) => {
        previewPost = p;
        activeModal = 'update-post';
      }"
    />
  </main>

  <ImageLightbox
    :open="isLightboxOpen"
    :image-urls="lightbox?.imageUrls ?? []"
    :initial-index="lightbox?.index ?? 0"
    @close="isLightboxOpen = false"
  />

  <CreateCommentModal
    v-if="previewPost"
    :open="activeModal === 'create-comment'"
    :is-pending="createCommentMutation.isPending.value"
    :my-profile-image-url="me?.profileImageUrl"
    :author-profile-url="previewPost.user.profileImageUrl"
    :text="previewPost.text"
    :image-urls="previewPost.imageUrls"
    @update:open="(open) => {
      activeModal = open ? 'create-comment' : null;
    }"
    @create-comment="(commentText) => {
      if (!previewPost) {
        return;
      }

      createCommentMutation.mutate({
        postId: previewPost.id,
        text: commentText,
      });
    }"
  />

  <UpdatePostModal
    v-if="previewPost"
    :open="activeModal === 'update-post'"
    :post="previewPost"
    @update:open="(open) => {
      activeModal = open ? 'update-post' : null;
    }"
    @update-post="(payload) => {
      if (!previewPost) {
        return;
      }

      updatePostMutation.mutate({
        postId: previewPost.id,
        ...payload,
      });
    }"
    :is-pending="updatePostMutation.isPending.value"
  />

  <ConfirmModal
    v-if="previewPost"
    :open="activeModal === 'delete-post'"
    title="Delete this post?"
    message="If you remove this post, you won't be able to recover it."
    confirm-button-text="Delete"
    :is-pending="deletePostMutation.isPending.value"
    @update:open="activeModal = 'delete-post'"
    @confirm="() => {
      if (!previewPost) {
        return;
      }

      deletePostMutation.mutate({
        postId: previewPost.id,
      });
      activeModal = null;
    }"
    @cancel="() => {
      activeModal = null;
    }"
  />
</template>