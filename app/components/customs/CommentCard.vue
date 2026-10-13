<!-- app/comments/customs/CommentCard.vue -->

<script setup lang="ts">
import type { Comment } from '@/types/comment';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import { formatRelativeTime } from '@/lib/format-relative-time';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import { repliesInfiniteQuery } from '@/queries/replies.infinite-query';
import ReplyCard from '@/components/customs/ReplyCard.vue';
import type { DropdownMenuItem } from "@nuxt/ui";
import { meQuery } from '@/queries/me.query';

interface Props {
  comment: Comment;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'toggle-like': [commentId: string];
  'reply-comment': [payload: { comment: Comment; reply?: Comment }];
  'delete-comment': [payload: { comment: Comment; reply?: Comment }];
  'update-comment': [payload: { comment: Comment; reply?: Comment }];
}>();

const { data: me } = useQuery(meQuery());

const hasRequestedReplies = ref(false);
const isExpanded = ref(false);

const {
  data: paginatedReplies,
  error: repliesError,
  isLoading: isRepliesLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
} = useInfiniteQuery({
  ...repliesInfiniteQuery(props.comment.id),
  enabled: hasRequestedReplies,
});

const replies = computed(
  () => paginatedReplies.value?.pages.flatMap((page) => page.data) ?? [],
);

const remainingReplies = computed(() =>
  Math.max(props.comment.meta.totalReplies - replies.value.length, 0),
);

const isFetching = computed(() => isRepliesLoading.value || isFetchingNextPage.value);

const showViewMore = computed(() => {
  if (props.comment.meta.totalReplies === 0) return false;
  if (!isExpanded.value) return true;
  return !!hasNextPage.value;
});

const viewMoreLabel = computed(() => {
  if (isExpanded.value && isFetching.value) return 'Loading...';

  if (!isExpanded.value) {
    const total = props.comment.meta.totalReplies;
    return `View ${total} ${total === 1 ? 'reply' : 'replies'}`;
  }

  return `View ${remainingReplies.value} more`;
});

const handleViewMore = () => {
  if (!isExpanded.value) {
    hasRequestedReplies.value = true;
    isExpanded.value = true;
    return;
  }
  fetchNextPage();
};

const handleHide = () => {
  isExpanded.value = false;
};

const isLiked = ref(props.comment.viewer.isLiked);
const totalLikes = ref(props.comment.meta.totalLikes);

watch(
  () => [props.comment.viewer.isLiked, props.comment.meta.totalLikes] as const,
  ([newIsLiked, newTotalLikes]) => {
    isLiked.value = newIsLiked;
    totalLikes.value = newTotalLikes;
  },
);

const moreDropdownItems = ref<DropdownMenuItem[]>(
  [
    {
      label: 'Update',
      icon: 'i-lucide-pen',
      onSelect: () => {
        emit('update-comment', { comment: props.comment });
      },
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      onSelect: () => {
        emit('delete-comment', { comment: props.comment });
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
  <div class="flex gap-x-4 py-2 px-4 border-b border-gray-700">
    <NuxtLink
      class="shrink-0 block size-10 border border-gray-500 rounded-full overflow-hidden"
      :href="`/profile/${comment.user.username}`"
    >
      <img
        class="size-full object-cover"
        :src="comment.user.profileImageUrl || defaultProfile"
        width="auto"
        height="auto"
        :alt="comment.user.fullname"
      />
    </NuxtLink>

    <div class="flex-1 flex flex-col gap-y-1">
      <div class="flex justify-between items-start">
        <div class="flex gap-x-2">
          <NuxtLink
            class="text-xs hover:underline text-gray-400 hover:text-white"
            :href="`/profile/${comment.user.username}`"
          >
            @{{ comment.user.username }}
          </NuxtLink>

          <p
            v-if="comment.createdAt !== comment.updatedAt"
            class="relative top-0 text-xs text-gray-400"
          >
            (edited)
          </p>
        </div>

          <UDropdownMenu
            :items="me?.id === comment.user.id ? moreDropdownItems.slice(0, 2) : moreDropdownItems.slice(-1)" 
            :content="{ align: 'end', side: 'bottom' }"
            :ui="{
              content: 'w-fit bg-gray-800',
              item: 'cursor-pointer data-highlighted:rounded data-highlighted:bg-gray-700'
            }"
          >
            <button class="flex items-start size-4 cursor-pointer text-gray-400 hover:text-white">
              <Icon name="lucide:ellipsis" class="size-4" />
            </button>
          </UDropdownMenu>
      </div>
      <p class="text-sm">
        {{ comment.text }}
      </p>
      <div class="flex justify-between text-gray-400">
        <div class="flex gap-x-4">
          <p class="text-xs">
            {{ formatRelativeTime(new Date(comment.createdAt)) }}
          </p>

          <button
            class="text-xs cursor-pointer hover:text-white"
            @click="emit('reply-comment', { comment })"
          >
            Reply
          </button>
        </div>

        <button
          class="flex items-center gap-x-1 rounded-full cursor-pointer"
          @click.stop="() => {
            isLiked = !isLiked;
            totalLikes += isLiked ? 1 : -1;
            emit('toggle-like', props.comment.id);
          }"
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
              'text-xs',
              isLiked && 'text-red-500',
            )"
          >
            {{ totalLikes }}
          </span>
        </button>
      </div>

      <template v-if="isExpanded && replies.length > 0">
        <ReplyCard
          v-for="reply in replies"
          :key="reply.id"
          :reply
          @toggle-like="(replyId) => emit('toggle-like', replyId)"
          @open-reply-modal="(r) => emit('reply-comment', { comment, reply: r })"
          @delete-comment="(r) => emit('delete-comment', { comment, reply: r })"
          @update-comment="(r) => {
            if (r.repliedToComment) {
              emit('update-comment', {
                comment: r.repliedToComment,
                reply: r
              });
            }
            else {
              emit('update-comment', {
                comment,
                reply: r
              });             
            }
          }"
        />
      </template>

      <p v-if="isExpanded && repliesError" class="text-xs text-red-500">
        Failed to load replies.
      </p>

      <div class="flex gap-x-4">
        <button
          v-if="showViewMore"
          class="text-xs cursor-pointer text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isExpanded && isFetching"
          @click="handleViewMore"
        >
          {{ viewMoreLabel }}
        </button>

        <button
          v-if="isExpanded && replies.length > 0"
          class="text-xs cursor-pointer text-gray-400 hover:text-white"
          @click="handleHide"
        >
          Hide
        </button>
      </div>
    </div>
  </div>
</template>