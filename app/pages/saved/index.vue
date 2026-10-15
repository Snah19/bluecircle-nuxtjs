<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { savedPostsInfiniteQuery } from '~/queries/saved-posts.infinite-query';
import PostList from '@/components/customs/PostList.vue';
import { toggleLike } from '@/functions/toggle-like';
import { toggleRepost } from '@/functions/toggle-repost';
import { toggleSave } from '@/functions/toggle-save';
import ImageLightbox from '@/components/customs/ImageLightbox.vue';
import CreateCommentModal from '@/components/customs/CreateCommentModal.vue';
import UpdatePostModal from '@/components/customs/UpdatePostModal.vue';
import { createComment } from '@/functions/create-comment';
import { updatePost } from '@/functions/update-post';
import { deletePost } from '@/functions/delete-post';
import ConfirmModal from "@/components/customs/ConfirmModal.vue";

type Modal = 'create-comment' | 'update-post' | 'delete-post' | null;

useHead({
  title: 'Saved - Bluecircle'
});

const router = useRouter();
const queryClient = useQueryClient();
const lightbox = ref<{ imageUrls: string[]; index: number } | null>(null);
const isLightboxOpen = ref(false);
const openLightbox = (payload: { imageUrls: string[]; index: number }) => {
  lightbox.value = payload;
  isLightboxOpen.value = true;
};
const activeModal = ref<Modal>(null);
const target = ref<{
  id: string;
  profileImageUrl: string | null,
  text: string;
  imageUrls: string[];
  parentId: string | null;
} | null>(null);

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

const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  }
  else {
    navigateTo('/');
  }
};
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

      <h1 class="text-xl font-bold">Saved Posts</h1>
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
        target = {
          id: p.id,
          profileImageUrl: p.user.profileImageUrl,
          text: p.text,
          imageUrls: p.imageUrls,
          parentId: null,
        };
        activeModal = 'create-comment';
      }"
      @open-delete-post-modal="(p) => {
        target = {
          id: p.id,
          profileImageUrl: p.user.profileImageUrl,
          text: p.text,
          imageUrls: p.imageUrls,
          parentId: null,
        };
        activeModal = 'delete-post';
      }"
      @open-update-post-modal="(p) => {
        target = {
          id: p.id,
          profileImageUrl: p.user.profileImageUrl,
          text: p.text,
          imageUrls: p.imageUrls,
          parentId: null,
        };
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
    v-if="target"
    :open="activeModal === 'create-comment'"
    :is-pending="createCommentMutation.isPending.value"
    :target
    @close="activeModal = null"
    @submit="(commentText) => {
      if (!target) {
        return;
      }

      createCommentMutation.mutate({
        postId: target.id,
        text: commentText,
      });
    }"
  />

  <UpdatePostModal
    v-if="target"
    :open="activeModal === 'update-post'"
    :target
    :is-pending="updatePostMutation.isPending.value"
    @close="activeModal = null"
    @submit="(payload) => {
      if (!target) {
        return;
      }

      updatePostMutation.mutate({
        postId: target.id,
        ...payload,
      });
    }"
  />

  <ConfirmModal
    v-if="target"
    :open="activeModal === 'delete-post'"
    title="Delete this post?"
    message="If you remove this post, you won't be able to recover it."
    confirm-button-text="Delete"
    :is-pending="deletePostMutation.isPending.value"
    @update:open="activeModal = 'delete-post'"
    @confirm="() => {
      if (!target) {
        return;
      }

      deletePostMutation.mutate({
        postId: target.id,
      });
      activeModal = null;
    }"
    @cancel="() => {
      activeModal = null;
    }"
  />
</template>