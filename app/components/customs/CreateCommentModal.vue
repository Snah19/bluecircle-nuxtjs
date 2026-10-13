<!-- app/components/customs/CreateCommentModal.vue -->

<script setup lang="ts">
import defaultProfile from '@/assets/svgs/default-profile.svg';
import AutoGrowTextArea from '@/components/customs/AutoGrowTextArea.vue';
import type { Post } from '@/types/post';
import type { Comment } from '@/types/comment';
import { useQuery } from '@tanstack/vue-query';
import { meQuery } from '@/queries/me.query';

interface Props {
  open: boolean;
  target: {
    id: string;
    profileImageUrl: string | null,
    text: string;
    imageUrls: string[];
    parentId: string | null;
  };
  isPending?: boolean;
  type?: 'comment' | 'reply';
};

const props = withDefaults(defineProps<Props>(), {
  type: 'comment',
});

const emit = defineEmits<{
  'close': [];
  'submit': [text: string];
}>();

const { data: me } = useQuery(meQuery());

const MAX_LENGTH = 400;
const MAX_IMAGES = 4;

const isPost = (value: Post | Comment): value is Post => 'imageUrls' in value;

const commentText = ref('');
const remaining = computed(() => MAX_LENGTH - commentText.value.length);
const canSubmit = computed(() => !props.isPending && commentText.value.trim().length > 0);

const imageUrls = computed(() => props.target.imageUrls);
const visibleImageUrls = computed(() => imageUrls.value.slice(0, MAX_IMAGES));
const extraImagesCount = computed(() => Math.max(0, imageUrls.value.length - MAX_IMAGES));

const submit = () => {
  if (!canSubmit.value) {
    return;
  }

  emit('submit', commentText.value.trim());
};

// Start empty every time the modal opens.
// Clearing on open (not on close) avoids an empty flash during the close animation.
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      commentText.value = '';
    }
  }
);
</script>

<template>
  <UModal
    :open="open"
    :dismissible="!isPending"
    :ui="{
      content: 'max-w-150 rounded-lg ring ring-gray-700 bg-gray-900',
      overlay: 'bg-black/70'
    }"
    @update:open="emit('close')"
  >
    <template #content>
      <div>
        <div class="flex justify-between items-center py-2 px-4 border-b border-gray-700">
          <button
            class="text-sm cursor-pointer text-blue-500 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isPending"
            @click="emit('close')"
          >
            Cancel
          </button>

          <button
            class="inline-flex items-center gap-x-2 py-2 px-4 text-sm capitalize rounded-full cursor-pointer bg-blue-500 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canSubmit"
            @click="submit"
          >
            {{ type }}
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="size-4 animate-spin"
            />
          </button>
        </div>

        <div class="max-h-100 px-4 overflow-auto">
          <div class="flex justify-between py-4 border-b border-gray-700">
            <div class="flex gap-x-4">
              <div class="size-10 shrink-0 border border-gray-500 rounded-full overflow-hidden">
                <img
                  class="size-full object-cover"
                  :src="target.profileImageUrl || defaultProfile"
                  alt=""
                />
              </div>

              <div class="flex-1 text-sm">
                <p>
                  {{ target.text }}
                </p>
              </div>
            </div>

            <div
              v-if="visibleImageUrls.length > 0"
              :class="cn(
                'shrink-0 grid gap-0.5 size-16 overflow-hidden',
                visibleImageUrls.length === 2 && 'grid-cols-2',
                visibleImageUrls.length >= 3 && 'grid-cols-2 grid-rows-2',
              )"
            >
              <div
                v-for="(imageUrl, index) in visibleImageUrls"
                :key="imageUrl"
                :class="cn(
                  'relative',
                  visibleImageUrls.length === 2 && 'aspect-square',
                  visibleImageUrls.length === 3 && index === 0 && 'row-span-2',
                )"
              >
                <img
                  class="w-full h-full object-cover"
                  :src="imageUrl"
                  alt=""
                />

                <!-- +N overlay on the last visible image -->
                <div
                  v-if="index === MAX_IMAGES - 1 && extraImagesCount > 0"
                  class="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-semibold"
                >
                  +{{ extraImagesCount }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-x-4 py-4">
            <div class="size-10 shrink-0 border border-gray-500 rounded-full overflow-hidden">
              <img
                class="w-full h-full object-cover"
                :src="me?.profileImageUrl || defaultProfile"
                alt=""
              />
            </div>

            <div class="flex-1">
              <AutoGrowTextArea
                v-model="commentText"
                :max-length="MAX_LENGTH"
                :placeholder="type === 'comment' ? 'Write your comment' : 'Write your reply'"
                :is-focused="open"
              />
            </div>
          </div>
        </div>

        <div class="p-2 pr-4 border-t border-gray-700">
          <p
            class="text-xs text-right"
            :class="cn(
              remaining > 20 && 'text-green-500',
              remaining <= 20 && remaining > 10 && 'text-yellow-500',
              remaining <= 10 && 'text-red-500'
            )"
          >
            {{ remaining }}
          </p>
        </div>
      </div>
    </template>
  </UModal>
</template>