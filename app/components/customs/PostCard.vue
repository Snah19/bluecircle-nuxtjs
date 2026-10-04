<!-- app/components/customs/PostCard.vue -->

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Post } from '@/types/post';
import { cn } from '@/lib/utils';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import { formatRelativeTime } from '@/lib/format-relative-time';
import { useQuery } from '@tanstack/vue-query';
import { meQuery } from '@/queries/me.query';

interface Props {
  post: Post;
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
}>();

const { data: me } = useQuery(meQuery());

const isReposted = ref(props.post.viewer.isReposted);
const totalReposts = ref(props.post.meta.totalReposts);

const isLiked = ref(props.post.viewer.isLiked);
const totalLikes = ref(props.post.meta.totalLikes);

const isSaved = ref(props.post.viewer.isSaved);

const handleToggleRepost = () => {
  isReposted.value = !isReposted.value;
  totalReposts.value += isReposted.value ? 1 : -1;

  emit('toggleRepost', props.post.id);
};

watch(
  () => [
    props.post.viewer.isReposted,
    props.post.meta.totalReposts
  ] as const,
  ([newIsReposted, newTotalReposts]) => {
    isReposted.value = newIsReposted;
    totalReposts.value = newTotalReposts;
  },
);

const handleToggleLike = () => {
  isLiked.value = !isLiked.value;
  totalLikes.value += isLiked.value ? 1 : -1;

  emit('toggleLike', props.post.id);
};

watch(
  () => [
    props.post.viewer.isLiked,
    props.post.meta.totalLikes,
  ] as const,
  ([newIsLiked, newTotalLikes]) => {
    isLiked.value = newIsLiked;
    totalLikes.value = newTotalLikes;
  },
);

const handleToggleSave = () => {
  isSaved.value = !isSaved.value;

  emit('toggleSave', props.post.id);
}

watch(
  () => props.post.viewer.isSaved,
  (newIsSaved) => {
    isSaved.value = newIsSaved;
  },
);

const shareDropdownItems = ref<DropdownMenuItem[]>(
  [
    {
      label: 'Copy Link',
      icon: 'i-lucide-link',
      onSelect: () => {
      },
    },
  ]
);

const moreDropdownItems = ref<DropdownMenuItem[]>(
  [
    {
      label: 'Update',
      icon: 'i-lucide-pen',
      onSelect: () => {
        emit('openUpdatePostModal', props.post);
      },
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      onSelect: () => {
        emit('openDeletePostModal', props.post);
      }
    },
    {
      label: 'Report',
      icon: 'i-lucide-flag',
      onSelect: () => {
        // future implementation
      }
    },
  ],
);
</script>

<template>
  <div class="flex gap-x-4 p-4 border-b border-gray-700 cursor-pointer">
    <div class="shrink-0 size-10 border border-gray-500 rounded-full overflow-hidden">
      <img
        class="size-full object-cover"
        :src="post.user.profileImageUrl || defaultProfile"
        width="auto"
        height="auto"
        :alt="`${post.user.fullname}, ${post.user.username}`"
      />
    </div>
    <div class="flex-1 space-y-2">
      <div>
        <p class="text-xs">
          <span class="font-bold">
            {{ post.user.fullname }}
          </span>
            &bull;
          <span class="text-gray-400">
            @{{ post.user.username }}
          </span>
            &bull;
          <span class="text-gray-400">
            {{ formatRelativeTime(new Date(post.createdAt)) }}
          </span>
        </p>
        <p class="text-sm ">
          {{ post.text }}
        </p>
      </div>

      <div
        v-if="post.imageUrls.length > 4"
        class="flex gap-x-0.5 rounded-xl overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="(imageUrl, index) in post.imageUrls"
          :key="imageUrl"
          class="shrink-0 w-[85%] aspect-square snap-center overflow-hidden"
          @click.stop="emit('openLightbox', { imageUrls: post.imageUrls, index })"
        >
          <img
            class="size-full object-cover"
            :src="imageUrl"
            alt=""
          />          
        </div>       
      </div>

      <div
        v-else
        :class="cn(
        'grid gap-0.5 rounded-xl overflow-hidden',
        post.imageUrls.length === 2 && 'grid-cols-2',
        post.imageUrls.length === 3 && 'grid-cols-2 grid-rows-2 aspect-video',
        post.imageUrls.length === 4 && 'grid-cols-2 grid-rows-2 aspect-video',
        )"
      >
        <div
          v-for="(imageUrl, index) in post.imageUrls"
          :key="imageUrl"
          :class="cn(
            post.imageUrls.length === 2 && 'aspect-square',
            post.imageUrls.length === 3 && index === 0 && 'row-span-2',
          )"
          @click.stop="emit('openLightbox', { imageUrls: post.imageUrls, index })"
        >
          <img
            class="w-full h-full object-cover"
            :src="imageUrl"
            alt=""
          />
        </div>
      </div>

      <div class="flex items-center justify-between text-gray-400">
        <div class="grid grid-cols-3 w-[80%]">
          <button
            class="flex items-center gap-x-1 rounded-full cursor-pointer"
            @click.stop="emit('openCommentModal', post)"
          >
            <Icon name="lucide:message-circle" class="size-4" />
            <span class="text-sm tracking-normal" v-if="post.meta.totalComments > 0">
              {{ post.meta.totalComments }}
            </span>
          </button>

          <button
            class="flex items-center gap-x-1 rounded-full cursor-pointer"
            @click.stop="handleToggleRepost"
          >
            <Icon
              name="lucide:repeat-2"
              :class="cn(
                'size-5',
                isReposted && 'text-green-500',
              )"
            />
            <span
              v-if="totalReposts > 0"
              :class="cn(
                'text-sm',
                isReposted && 'text-green-500',
              )"
            >
              {{ totalReposts }}
            </span>
          </button>

          <button
            class="flex items-center gap-x-1 rounded-full cursor-pointer"
            @click.stop="handleToggleLike"
          >
            <Icon
              name="lucide:heart"
              :class="cn(
                'size-4',
                isLiked && 'text-red-500',
              )"
            />
            <span
              v-if="totalLikes > 0"
              :class="cn(
                'text-sm',
                isLiked && 'text-red-500',
              )"
            >
              {{ totalLikes }}
            </span>
          </button>
        </div>

        <div class="flex items-center gap-x-6">
          <button
            class="flex justify-center items-center rounded-full cursor-pointer"
            @click.stop="handleToggleSave"
          >
            <Icon
              name="lucide:bookmark"
              :class="cn(
                'size-4',
                isSaved && 'text-blue-500'
              )"
            />
          </button>

          <UDropdownMenu
            :items="shareDropdownItems"
            :content="{ align: 'end', side: 'bottom' }"
            :ui="{
              content: 'w-fit bg-gray-800',
              item: 'cursor-pointer data-highlighted:rounded data-highlighted:bg-gray-700'
            }"
          >
            <button
              class="flex justify-center items-center rounded-full cursor-pointer"
            >
              <Icon name="lucide:forward" class="size-4" />
            </button>
          </UDropdownMenu>
          <UDropdownMenu
            :items="me?.id === post.user.id ? moreDropdownItems.slice(0, 2) : moreDropdownItems.slice(-1)" 
            :content="{ align: 'end', side: 'bottom' }"
            :ui="{
              content: 'w-fit bg-gray-800',
              item: 'cursor-pointer data-highlighted:rounded data-highlighted:bg-gray-700'
            }"
          >
            <button
              type="button"
              class="flex justify-center items-center rounded-full cursor-pointer"
              @click.stop
            >
              <Icon name="lucide:ellipsis" class="size-4" />
            </button>
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>