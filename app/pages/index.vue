<!-- app/pages/index.vue -->

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import blueCircle from '@/assets/svgs/blue-circle.svg';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import { meQuery } from '@/queries/me.query';
import CreatePostModal from '@/components/customs/CreatePostModal.vue';
import { createPost } from '@/functions/create-post';

type Feed = 'discover' | 'following';

const feedCookie = useCookie<Feed>('active_feed', {
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
  sameSite: 'strict',
  default: () => 'discover',
});

const activeFeed = ref<Feed>(feedCookie.value);
const activeModal = ref<'create-post' | null>(null);

watch(activeFeed, (newValue) => {
  feedCookie.value = newValue;
});

const feedLabel = computed(() =>
  activeFeed.value === 'discover' ? 'Discover' : 'Following'
);

useHead({
  title: () => `${feedLabel.value} - Bluecircle`,
});

const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
  },
  onError: (error) => {
    console.error(error);
  },
});

const { data: me } = useQuery(meQuery());
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="flex justify-center items-center p-2">
      <img
        :src="blueCircle"
        alt="bluecircle"
      />
    </div>
    <div class="flex border-b border-gray-700">
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
</template>