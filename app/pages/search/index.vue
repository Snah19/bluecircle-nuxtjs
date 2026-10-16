<!-- app/pages/search/index.vue -->

<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { searchedUsersInfiniteQuery } from '~/queries/searched-users.infinite-query';
import { serchedPostsInfiniteQuery } from '~/queries/searched-posts.infinite-query';
import PostList from '@/components/customs/PostList.vue';
import UserList from '@/components/customs/UserList.vue';
import ImageLightbox from '@/components/customs/ImageLightbox.vue';
import CreateCommentModal from '@/components/customs/CreateCommentModal.vue';
import ConfirmModal from "@/components/customs/ConfirmModal.vue";
import UpdatePostModal from '@/components/customs/UpdatePostModal.vue';
import { createComment } from '@/functions/create-comment';
import { deletePost } from '@/functions/delete-post';
import { toggleLike } from '@/functions/toggle-like';
import { toggleRepost } from '@/functions/toggle-repost';
import { toggleSave } from '@/functions/toggle-save';
import { updatePost } from '@/functions/update-post';

type Tab = 'posts' | 'people';
type Modal = 'create-comment' | 'update-post' | 'delete-post' | null;

const tabCookie = useCookie<Tab>('search_tab', {
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
  sameSite: 'strict',
  default: () => 'posts',
});
const queryClient = useQueryClient();

const activeTab = ref<Tab>(tabCookie.value);
watch(activeTab, (newValue) => {
  tabCookie.value = newValue;
});
const activeModal = ref<Modal>(null);

const searchTerm = useSearchTerm();
const enabled = computed(() => searchTerm.value.length > 0);

const lightbox = ref<{ imageUrls: string[]; index: number } | null>(null);
const isLightboxOpen = ref(false);
const openLightbox = (payload: { imageUrls: string[]; index: number }) => {
  lightbox.value = payload;
  isLightboxOpen.value = true;
};

const urlTerm = useSearchTerm();

// Local draft: what the user is typing before they submit
const term = ref(urlTerm.value);

// Keep the input in sync when the URL changes from somewhere else
// (back/forward buttons, clicking a hashtag link, leaving the search page)
watch(urlTerm, (value) => {
  term.value = value;
});

const submit = () => {
  const value = term.value.trim();
  if (!value) return;

  navigateTo({ path: '/search', query: { query: value } });
};

const target = ref<{
  id: string;
  profileImageUrl: string | null,
  text: string;
  imageUrls: string[];
  parentId: string | null;
} | null>(null);

const searchedUsersQuery = useInfiniteQuery(
  computed(() => ({
    ...searchedUsersInfiniteQuery(searchTerm.value),
    enabled: enabled.value,
  })),
);

const searchedPostsQuery = useInfiniteQuery(
  computed(() => ({
    ...serchedPostsInfiniteQuery(searchTerm.value),
    enabled: enabled.value,
  })),
);

const users = computed(
  () => searchedUsersQuery.data.value?.pages.flatMap((page) => page.data) ?? [],
);

const posts = computed(
  () => searchedPostsQuery.data.value?.pages.flatMap((page) => page.data) ?? [],
);

const activeQuery = computed(() =>
  activeTab.value === 'people' ? searchedUsersQuery : searchedPostsQuery,
);

const activeList = computed(() =>
  activeTab.value === 'people' ? users.value : posts.value,
);

const showEmpty = computed(() => {
  const query = activeQuery.value;
  return (
    enabled.value &&
    !query.isLoading.value &&
    !query.isError.value &&
    activeList.value.length === 0
  );
});

const loadMore = () => {
  const query = activeQuery.value;
  if (query.hasNextPage.value && !query.isFetchingNextPage.value) {
    query.fetchNextPage();
  }
};

const retry = () => activeQuery.value.refetch();

const toggleRepostMutation = useMutation({
  mutationFn: toggleRepost,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['search', 'posts', searchTerm.value] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleLikeMutation = useMutation({
  mutationFn: toggleLike,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['search', 'posts', searchTerm.value] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleSaveMutation = useMutation({
  mutationFn: toggleSave,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['search', 'posts', searchTerm.value] });
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
    queryClient.invalidateQueries({ queryKey: ['search', 'posts', searchTerm.value] });
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
    queryClient.invalidateQueries({ queryKey: ['search', 'posts', searchTerm.value] });
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
    queryClient.invalidateQueries({ queryKey: ['search', 'posts', searchTerm.value] });
  },
  onError: (error) => {
    console.error(error);
  },
});

useHead({
  title: computed(() =>
    searchTerm.value ? `${searchTerm.value} - Search - Bluecircle` : 'Search - Bluecircle',
  ),
});
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="z-50 sticky top-0 flex flex-col gap-y-4 p-4 pb-0 border-b border-gray-700 bg-gray-900">
      <form
        class="flex overflow-hidden rounded-lg border border-gray-700"
        @submit.prevent="submit"
      >
        <input
          v-model="term"
          name="query"
          :class="cn(
            'min-w-0 w-full p-2 focus-within:outline-0'
          )"
          placeholder="Search"
          autocomplete="off"
        />
        <button
          type="submit"
          class="shrink-0 flex justify-center items-center px-4 cursor-pointer bg-gray-700 hover:bg-gray-600"
        >
          <Icon name="lucide:search" />
        </button>
      </form>

      <div class="flex gap-x-4">
        <button
          class="relative pb-4 cursor-pointer"
          @click="activeTab = 'posts'"
        >
          Posts
          <span
            v-if="activeTab === 'posts'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
          />
        </button>
        <button
          class="relative pb-4 cursor-pointer"
          @click="activeTab = 'people'"
        >
          People
          <span
            v-if="activeTab === 'people'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
          />
        </button>
      </div>
    </div>

    <PostList
      v-if="activeTab === 'posts'"
      :posts
      :is-loading="searchedPostsQuery.isLoading.value"
      :is-error="searchedPostsQuery.isError.value"
      :has-next-page="searchedPostsQuery.hasNextPage.value"
      :is-fetching-next-page="searchedPostsQuery.isFetchingNextPage.value"
      @load-more="loadMore"
      @retry="retry"
      @open-lightbox="openLightbox"
      @toggle-repost="(postId) => toggleRepostMutation.mutate({ postId })"
      @toggle-like="(postId) => toggleLikeMutation.mutate({ postId })"
      @toggle-save="(postId) => toggleSaveMutation.mutate({ postId })"
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
    <UserList
      v-else-if="activeTab === 'people'"
      :users
      :is-loading="searchedUsersQuery.isLoading.value"
      :is-error="searchedUsersQuery.isError.value"
      :has-next-page="searchedUsersQuery.hasNextPage.value"
      :is-fetching-next-page="searchedUsersQuery.isFetchingNextPage.value"
      @load-more="loadMore"
      @retry="retry"
      @toggle-follow=""
    />

    <div
      v-if="showEmpty"
      class="space-y-2 m-4 p-4 text-sm rounded-lg bg-gray-800"
    >
      <p>
        No results found for “<span class="font-bold">{{ searchTerm }}</span>”.
      </p>
      <p>
        Try a different search term.
      </p>
    </div>

  <div
    v-if="!searchTerm"
    class="flex flex-col items-center gap-3 px-6 py-16 text-center"
  >
    <div class="flex size-14 items-center justify-center rounded-full bg-gray-800">
      <Icon name="lucide:search" class="size-7 text-gray-400" />
    </div>
    <p class="text-lg font-bold">
      Search Something!
    </p>
    <p class="max-w-xs text-sm text-gray-400">
      Look up posts and people. Type something in the search box to get started.
    </p>
  </div>
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

  <UpdatePostModal
    v-if="target"
    :open="activeModal === 'update-post'"
    :is-pending="updatePostMutation.isPending.value"
    :target
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
</template>