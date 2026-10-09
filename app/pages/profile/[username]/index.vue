<!-- app/pages/[username]/index.vue -->

<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { meQuery } from '@/queries/me.query';
import { userQuery } from '@/queries/user.query';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import PostList from '@/components/customs/PostList.vue';
import ImageLightbox from '@/components/customs/ImageLightbox.vue';
import EditProfileModal from '@/components/customs/EditProfileModal.vue';
import CreateCommentModal from '@/components/customs/CreateCommentModal.vue';
import UpdatePostModal from '@/components/customs/UpdatePostModal.vue';
import ConfirmModal from "@/components/customs/ConfirmModal.vue";
import { toggleRepost } from '@/functions/toggle-repost';
import { toggleLike } from '@/functions/toggle-like';
import { toggleSave } from '@/functions/toggle-save';
import type { Post } from '@/types/post';
import { createComment } from '~/functions/create-comment';
import { userPostsInfiniteQuery } from '@/queries/user-posts.infinite-query';
import { userRepostsInfiniteQuery } from '@/queries/user-reposts.infinite-query';
import { userLikedPostsInfiniteQuery } from '@/queries/user-liked-posts.infinite-query';
import { deletePost } from '@/functions/delete-post';
import { updatePost } from '@/functions/update-post';
import { updateProfile } from '@/functions/update-profile';
import { toggleFollow } from '@/functions/toggle-follow';

type Tab = 'posts' | 'reposts' | 'likes';
type Modal = 'edit-profile' | 'create-comment' | 'update-post' | 'delete-post' | null;

const tabCookie = useCookie<Tab>('profile_tab', {
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
  sameSite: 'strict',
  default: () => 'posts',
});

const route = useRoute();
const username = computed(() => route.params.username as string);
const queryClient = useQueryClient();

const activeTab = ref<Tab>(tabCookie.value);
const activeModal = ref<Modal>(null);
watch(activeTab, (newValue) => {
  tabCookie.value = newValue;
});
const lightbox = ref<{ imageUrls: string[]; index: number } | null>(null);
const isLightboxOpen = ref(false);
const openLightbox = (payload: { imageUrls: string[]; index: number }) => {
  lightbox.value = payload;
  isLightboxOpen.value = true;
};
const previewPost = ref<Post | null>(null);

const { data: me } = useQuery(meQuery());

if (import.meta.server) {
  await queryClient
    .query(userQuery(username.value))
    .catch(() => {});
}

const { data: user } = useQuery(
  computed(() => userQuery(username.value)),
);

const userPosts = useInfiniteQuery(
  userPostsInfiniteQuery(username.value),
);
const userReposts = useInfiniteQuery(
  userRepostsInfiniteQuery(username.value),
);

const userLikedPosts = useInfiniteQuery(
  userLikedPostsInfiniteQuery(username.value),
);

const activeQuery = computed(() => {
  switch(activeTab.value) {
    case 'posts': return userPosts;
    case 'reposts': return userReposts;
    case 'likes': return userLikedPosts;
  }
});

const isLoading = computed(
  () => userPosts.isPending.value || userReposts.isPending.value || userLikedPosts.isPending.value
);

const isError = computed(() => activeQuery.value.isError.value);
const hasNextPage = computed(() => activeQuery.value.hasNextPage.value);
const isFetchingNextPage = computed(
  () => userPosts.isFetchingNextPage.value || userReposts.isFetchNextPageError.value || userLikedPosts.isFetchNextPageError.value
);

const loadMore = () => {
  const query = activeQuery.value;
  if (query.hasNextPage.value && !query.isFetchingNextPage.value) {
    query.fetchNextPage();
  }
};

const retry = () => activeQuery.value.refetch();

const posts = computed(() => {
  switch (activeTab.value) {
    case 'posts': return userPosts.data.value?.pages.flatMap((page) => page.data) ?? [];
    case 'reposts': return userReposts.data.value?.pages.flatMap((page) => page.data) ?? [];
    case 'likes': return userLikedPosts.data.value?.pages.flatMap((page) => page.data) ?? [];
  }
});

const updateProfileMutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: (data) => {
    console.log(data);
    activeModal.value = null;
    queryClient.invalidateQueries({ queryKey: ['users', username.value] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleFollowMutation = useMutation({
  mutationFn: toggleFollow,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['users', username.value] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleLikeMutation = useMutation({
  mutationFn: toggleLike,
  onSuccess: (data) => {
    console.log(data);
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'reposts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'liked-posts'] }),
    ]);
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleRepostMutation = useMutation({
  mutationFn: toggleRepost,
  onSuccess: (data) => {
    console.log(data);
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'reposts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'liked-posts'] }),
    ]);
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleSaveMutation = useMutation({
  mutationFn: toggleSave,
  onSuccess: (data) => {
    console.log(data);
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'reposts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'liked-posts'] }),
    ]);
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
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'reposts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'liked-posts'] }),
    ]);
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
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'reposts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'liked-posts'] }),
    ]);
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
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'reposts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'liked-posts'] }),
      queryClient.invalidateQueries({ queryKey: ['users', username.value] }),
    ]);
  },
  onError: (error) => {
    console.error(error);
  },
});

const isOwner = computed(() => !!me.value && me.value.id === user.value?.id);

useHead({
  title: () => `@${username.value} - Bluecircle`,
});
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="relative">
      <div class="h-37.5 bg-gray-800">
        <img
          v-if="user?.coverImageUrl"
          class="size-full object-cover"
          :src="user.coverImageUrl"
        />
      </div>

      <button class="absolute top-4 left-4 flex justify-center items-center size-8 rounded-full cursor-pointer bg-gray-900 hover:bg-gray-700">
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>

      <div class="absolute top-1/2 left-4 -translate-y-1/2 size-22.5 border border-gray-500 rounded-full overflow-hidden bg-gray-800">
        <img
          v-if="user"
          class="size-full object-cover"
          :src="user?.profileImageUrl || defaultProfile"
        />
      </div>

      <div class="h-37.5 p-4">
        <div class="flex justify-end">
          <button
            v-if="!user"
            class="w-26 h-9 text-sm rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700"
          />
          <button
            v-if="user && isOwner"
            class="py-2 px-4 text-sm rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700"
            @click="activeModal = 'edit-profile'"
          >
            Edit Profile
          </button>

          <button
            v-if="user && !isOwner"
            :class="cn(
              'py-2 px-4 text-sm rounded-full cursor-pointer capitalize bg-gray-800 hover:bg-gray-700',
              (
                user.viewer.relationshipStatus === 'follow' ||
                user.viewer.relationshipStatus === 'follow back'
              ) && 'bg-blue-500 hover:bg-blue-600',
            )"
            @click="toggleFollowMutation.mutate({ userId: user.id })"
          >
            {{ user.viewer.relationshipStatus }}
          </button>
        </div>
        <div v-if="user">
          <h1 class="text-3xl font-bold line-clamp-1">
            {{ user.fullname }}
          </h1>
          <p class="text-sm text-gray-400">
            {{ `@${user.username}` }}
          </p>
          <div class="flex gap-x-2">
            <NuxtLink
              class="text-sm cursor-pointer hover:underline"
            >
              <span class="font-bold">
                {{ user.meta.totalFollowers }}
              </span>
              <span class="text-gray-400">
                Followers
              </span>
            </NuxtLink>

            <NuxtLink
              class="text-sm cursor-pointer hover:underline"
              :href="`/profile/${username}/follows`"
            >
              <span class="font-bold">
                {{ user.meta.totalFollowing }}
              </span>
              <span class="text-gray-400">
                Following
              </span>
            </NuxtLink>

            <p class="text-sm">
              <span class="font-bold">
                {{ user.meta.totalPosts }}
              </span>
              <span class="text-gray-400">
                Posts
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="user" class="px-4 text-sm">
      {{ user.bio }}
    </p>

    <div
      v-if="user"
      class="z-50 sticky top-0 flex border-b border-gray-700 bg-gray-900"
    >
      <button
        class="relative flex-1 py-4 cursor-pointer"
        @click="() => {
          activeTab = 'posts';
          queryClient.invalidateQueries({ queryKey: ['users', 'posts'] });
        }"
      >
        Posts
        <span
          v-if="activeTab === 'posts'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
        />
      </button>
      <button
        class="relative flex-1 py-4 cursor-pointer"
        @click="() => {
          activeTab = 'reposts';
          queryClient.invalidateQueries({ queryKey: ['users', 'reposts'] });
        }"
      >
        Reposts
        <span
          v-if="activeTab === 'reposts'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
        />
      </button>
      <button
        class="relative flex-1 py-4 cursor-pointer"
        @click="() => {
          activeTab = 'likes';
          queryClient.invalidateQueries({ queryKey: ['users', 'liked-posts'] });
        }"
      >
        Likes
        <span
          v-if="activeTab === 'likes'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
        />       
      </button>
    </div>

    <PostList
      v-if="user"
      :posts
      :is-loading="isLoading"
      :is-error="isError"
      :has-next-page="hasNextPage"
      :is-fetching-next-page="isFetchingNextPage"
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

  <EditProfileModal
    v-if="user"
    :open="activeModal === 'edit-profile'"
    :user="user"
    :is-pending="updateProfileMutation.isPending.value"
    @update:open="(open) => {
      activeModal = open ? 'edit-profile' : null;
    }"
    @update-profile="updateProfileMutation.mutate"
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