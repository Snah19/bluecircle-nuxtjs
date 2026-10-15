<!-- app/components/customs/ReplyCard.vue -->

<script setup lang="ts">
import type { Comment } from '@/types/comment';
import { formatRelativeTime } from '@/lib/format-relative-time';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import type { DropdownMenuItem } from "@nuxt/ui";
import { meQuery } from '@/queries/me.query';
import { useQuery } from '@tanstack/vue-query';
import { useAuthModalStore } from '@/store/auth-modal';

interface Props {
  reply: Comment;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'toggle-like': [commentId: string];
  'open-reply-modal': [reply: Comment];
  'delete-comment': [reply: Comment];
  'update-comment': [reply: Comment];
}>();

const { data: me } = useQuery(meQuery());
const authModal = useAuthModalStore();

const isLiked = ref(props.reply.viewer.isLiked);
const totalLikes = ref(props.reply.meta.totalLikes);

const handleToggleLike = () => {
  if (!me.value) {
    authModal.open();
    return;
  }

  isLiked.value = !isLiked.value;
  totalLikes.value += isLiked.value ? 1 : -1;
  emit('toggle-like', props.reply.id);
};

const moreDropdownItems = ref<DropdownMenuItem[]>(
  [
    {
      label: 'Update',
      icon: 'i-lucide-pen',
      onSelect: () => {
        if (!me.value) {
          authModal.open();
          return;
        }

        emit('update-comment', props.reply);
      },
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      onSelect: () => {
        if (!me.value) {
          authModal.open();
          return;
        }

        emit('delete-comment', props.reply);
      }
    },
    {
      label: 'Report',
      icon: 'i-lucide-flag',
      onSelect: () => {
        if (!me.value) {
          authModal.open();
          return;
        }

        // future implementation
      }
    },
  ],
);
</script>

<template>
  <div class="flex gap-x-4 py-2 pl-4 border-b border-l rounded-bl-xl border-gray-700">
    <NuxtLink
      class="shrink-0 block size-10 border border-gray-500 rounded-full overflow-hidden"
      :href="`/profile/${reply.user.username}`"
    >
      <img
        class="size-full object-cover"
        :src="reply.user.profileImageUrl || defaultProfile"
        width="auto"
        height="auto"
        :alt="reply.user.fullname"
      />
    </NuxtLink>

    <div class="flex-1 flex flex-col gap-y-1">
      <div class="flex justify-between items-start">
        <div class="flex gap-x-2">
          <NuxtLink
            class="relative top-0 text-xs hover:underline text-gray-400 hover:text-white"
            :href="`/profile/${reply.user.username}`"
          >
            @{{ reply.user.username }}
          </NuxtLink>

          <Icon v-if="reply.repliedToComment?.user.username" name="lucide:arrow-right" class="size-4 text-gray-400" />

          <NuxtLink
            v-if="reply.repliedToComment?.user.username"
            class="relative top-0 text-xs hover:underline text-gray-400 hover:text-white"
            :href="`/profile/${reply.repliedToComment?.user.username}`"
          >
            @{{ reply.repliedToComment?.user.username }}
          </NuxtLink>

          <p
            v-if="reply.createdAt !== reply.updatedAt"
            class="relative top-0 text-xs text-gray-400"
          >
            (edited)
          </p>
        </div>

        <UDropdownMenu
          :items="me?.id === reply.user.id ? moreDropdownItems.slice(0, 2) : moreDropdownItems.slice(-1)" 
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
        {{ reply.text }}
      </p>

      <div class="flex justify-between text-gray-400">
        <div class="flex gap-x-4">
          <p class="text-xs">
            {{ formatRelativeTime(new Date(reply.createdAt)) }}
          </p>

          <button
            class="text-xs cursor-pointer hover:text-white"
            @click="() => {
              if (!me) {
                authModal.open();
                return;
              }

              emit('open-reply-modal', reply);
            }"
          >
            Reply
          </button>
        </div>

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
              'text-xs',
              isLiked && 'text-red-500',
            )"
          >
            {{ totalLikes }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>