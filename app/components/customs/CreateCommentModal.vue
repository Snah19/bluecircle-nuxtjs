<!-- app/components/customs/CreateCommentModal.vue -->

<script setup lang="ts">
import defaultProfile from '@/assets/svgs/default-profile.svg';
import AutoGrowTextArea from '@/components/customs/AutoGrowTextArea.vue';

interface Props {
  open: boolean;
  isPending?: boolean;
  myProfileImageUrl?: string | null;
  text: string;
  imageUrls: string[];
  authorProfileUrl?: string | null;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [open: boolean];
  'create-comment': [text: string];
}>();

const MAX_LENGTH = 400;

const commentText = ref('');
const remaining = computed(() => MAX_LENGTH - commentText.value.length);
const canCreateComment = computed(() => !props.isPending && commentText.value.trim().length > 0);

const MAX_IMAGES = 4;

const visibleImageUrls = computed(() => props.imageUrls.slice(0, MAX_IMAGES));
const extraImagesCount = computed(() => Math.max(0, props.imageUrls.length - MAX_IMAGES));

const createComment = () => {
  if (!canCreateComment.value) {
    return;
  }

  emit('create-comment', commentText.value);
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
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
      content: 'max-w-150 rounded-lg ring ring-gray-700 bg-gray-800',
      overlay: 'bg-black/70'
    }"
    @update:open="emit('update:open', $event)"
  >
    <template #content>
      <div>
        <div class="flex justify-between items-center py-2 px-4 border-b border-gray-700">
          <button
            class="text-sm cursor-pointer text-blue-500 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isPending"
            @click="emit('update:open', false)"
          >
            Cancel
          </button>

          <button
            class="inline-flex items-center gap-x-2 py-2 px-4 text-sm rounded-full cursor-pointer bg-blue-500 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed "
            :disabled="!canCreateComment"
            @click="createComment"
          >
            Comment
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
                  :src="authorProfileUrl || defaultProfile"
                  width="auto"
                  height="auto"
                  alt=""
                />
              </div>

              <div class="flex-1 text-sm">
                <p>
                  {{ text }}
                </p>
              </div>
            </div>

            <div
              v-if="visibleImageUrls.length > 0"
              :class="cn(
                'grid gap-0.5 size-16 overflow-hidden',
                visibleImageUrls.length === 2 && 'grid-cols-2',
                visibleImageUrls.length >= 3 && 'grid-cols-2 grid-rows-2 aspect-video',
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
                :src="myProfileImageUrl || defaultProfile"
                width="auto"
                height="auto"
                alt=""
              />
            </div>

            <div class="flex-1">
              <AutoGrowTextArea
                v-model="commentText"
                :max-length="MAX_LENGTH"
                placeholder="Write your comment"
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