<!-- app/pages/index.vue -->

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import blueCircle from '@/assets/svgs/blue-circle.svg';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import { meQuery } from '@/queries/me.query';
import CreatePostModal from '@/components/customs/CreatePostModal.vue';
import { createPost } from '@/functions/create-post';
import { discoverPostsInfiniteQuery } from '@/queries/discover-posts.infinite-query';
import { followingPostsInfiniteQuery } from '@/queries/following-posts.infinite-query';
import { toggleRepost } from '@/functions/toggle-repost';
import { toggleLike } from '@/functions/toggle-like';
import { toggleSave } from '@/functions/toggle-save';
import PostCard from '@/components/customs/PostCard.vue';
import ImageLightbox from '@/components/customs/ImageLightbox.vue';
import CreateCommentModal from '@/components/customs/CreateCommentModal.vue';
import type { Post } from '@/types/post';
import { createComment } from '@/functions/create-comment';
import ConfirmModal from "@/components/customs/ConfirmModal.vue";
import { deletePost } from '@/functions/delete-post';
import UpdatePostModal from '@/components/customs/UpdatePostModal.vue';
import { updatePost } from '@/functions/update-post';

type Feed = 'discover' | 'following';

const feedCookie = useCookie<Feed>('active_feed', {
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
  sameSite: 'strict',
  default: () => 'discover',
});

const activeFeed = ref<Feed>(feedCookie.value);
const activeModal = ref<'create-post' | 'create-comment' | 'update-post' | 'delete-post' | null>(null);

const previewPost = ref<Post | null>(null);

const lightbox = ref<{ imageUrls: string[]; index: number } | null>(null);
const isLightboxOpen = ref(false);

const openLightbox = (payload: { imageUrls: string[]; index: number }) => {
  lightbox.value = payload;
  isLightboxOpen.value = true;
};

watch(activeFeed, (newValue) => {
  feedCookie.value = newValue;
});

const feedLabel = computed(() =>
  activeFeed.value === 'discover' ? 'Discover' : 'Following'
);

useHead({
  title: () => `${feedLabel.value} - Bluecircle`,
});

const queryClient = useQueryClient();

const { data: me } = useQuery(meQuery());

const discoverPosts = useInfiniteQuery(discoverPostsInfiniteQuery());
const followingPosts = useInfiniteQuery(followingPostsInfiniteQuery());

const posts = computed(() => {
  if (activeFeed.value === 'discover') {
    return discoverPosts.data.value?.pages.flatMap((page) => page.data) ?? [];
  }
  else {
    return followingPosts.data.value?.pages.flatMap((page) => page.data) ?? [];
  }
});

const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', 'discover'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] });
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
    queryClient.invalidateQueries({ queryKey: ['posts', 'discover'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleRepostMutation = useMutation({
  mutationFn: toggleRepost,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', 'discover'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleLikeMutation = useMutation({
  mutationFn: toggleLike,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', 'discover'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleSaveMutation = useMutation({
  mutationFn: toggleSave,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', 'discover'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] });
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
    queryClient.invalidateQueries({ queryKey: ['posts', 'discover'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] });
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
    queryClient.invalidateQueries({ queryKey: ['posts', 'discover'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] });
  },
  onError: (error) => {
    console.error(error);
  },
});
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="flex justify-center items-center p-2">
      <img
        :src="blueCircle"
        alt="bluecircle"
      />
    </div>
    <div class="sticky top-0 z-50 flex border-b border-gray-700 bg-gray-900">
      <button
        class="flex-1 py-3 font-medium cursor-pointer hover:bg-gray-800 relative"
        :class="activeFeed === 'discover' ? 'text-white' : 'text-gray-400'"
        @click="activeFeed = 'discover'"
      >
        Discover
        <span
          v-if="activeFeed === 'discover'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
        />
      </button>
      <button
        class="flex-1 py-3 font-medium cursor-pointer hover:bg-gray-800 relative"
        :class="activeFeed === 'following' ? 'text-white' : 'text-gray-400'"
        @click="activeFeed = 'following'"
      >
        Following
        <span
          v-if="activeFeed === 'following'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
        />
      </button>
    </div>
    <div
      v-if="me"
      class="flex justify-between items-center p-4 border-b border-gray-700 cursor-pointer"
      @click="activeModal = 'create-post'"
    >
      <div class="flex items-center gap-x-4">
        <div
          class='size-10 shrink-0 border border-gray-500 rounded-full overflow-hidden'
        >
          <img
            class="w-full h-full object-cover"
            :src="me.profileImageUrl || defaultProfile"
            width="auto"
            height="auto"
            alt=""
          />
        </div>
        <p class="text-sm text-gray-400">
          What’s up?
        </p>
      </div>
    </div>

    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post
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
        console.log(p.id);
        previewPost = p;
        activeModal = 'update-post';
      }"
    />

    <ImageLightbox
      :open="isLightboxOpen"
      :image-urls="lightbox?.imageUrls ?? []"
      :initial-index="lightbox?.index ?? 0"
      @close="isLightboxOpen = false"
    />
  </main>

  <CreatePostModal
    v-if="me"
    :open="activeModal === 'create-post'"
    @update:open="(open) => {
      activeModal = open ? 'create-post' : null;
    }"
    :me="me"
    @create-post="createPostMutation.mutate"
    :is-pending="createPostMutation.isPending.value"
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

  <ConfirmModal
    v-if="previewPost"
    :open="activeModal === 'delete-post'"
    title="Delete this post?"
    message="If you remove this post, you won't be able to recover it."
    confirm-button-text="Delete"
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