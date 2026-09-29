<!-- app/componets/customs/CreatePostModal.vue -->

<script setup lang="ts">
import type { User } from '@/types/user';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import AutoGrowTextArea from '@/components/customs/AutoGrowTextArea.vue';

interface Props {
  open: boolean;
  isPending?: boolean;
  me: User;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [open: boolean];
  'create-post': [payload: { text: string; files: File[] }];
}>();

const MAX_LENGTH = 400;
const MAX_IMAGES = 8;

const text = ref('');
const fileInputRef = ref<HTMLInputElement | null>(null);

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
};

const images = ref<ImageItem[]>([]);

const remaining = computed(() => MAX_LENGTH - text.value.length);
const canAddMoreImages = computed(() => images.value.length < MAX_IMAGES);
const canCreatePost = computed(() =>
  !props.isPending &&
  remaining.value >= 0 &&
  (text.value.trim().length > 0 || images.value.length > 0)
);

const openFilePicker = () => {
  if (!canAddMoreImages.value) {
    return;
  }

  fileInputRef.value?.click();
}

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) {
    return;
  }

  const availableSlots = MAX_IMAGES - images.value.length;
  const filesToAdd = Array.from(files)
    .filter((f) => f.type.startsWith('image/'))
    .slice(0, availableSlots);

  for (const f of filesToAdd) {
    images.value.push({
      id: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2)}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
    });
  }

  input.value = '';
}

const removeImage = (id: string) => {
  const target = images.value.find((img) => img.id === id);
  if (!target) {
    return;
  }

  URL.revokeObjectURL(target.previewUrl);
  images.value = images.value.filter((img) => img.id !== id);
}

const createPost = () => {
  if (!canCreatePost.value) {
    return;
  }

  emit('create-post', {
    text: text.value.trim(),
    files: images.value.map((img) => img.file),
  });
};

onBeforeUnmount(() => {
  images.value.forEach((img) => URL.revokeObjectURL(img.previewUrl));
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      text.value = '';
      images.value.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      images.value = [];
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
            :disabled="!canCreatePost"
            @click="createPost"
          >
            Create Post
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="size-4 animate-spin"
            />
          </button>
        </div>

        <div class="max-h-100 py-2 px-4 overflow-auto">
          <div class="flex gap-x-4 ">
            <div
              class="size-10 shrink-0 border border-gray-500 rounded-full overflow-hidden"
            >
              <img
                class="w-full h-full object-cover"
                :src="me.profileImageUrl || defaultProfile"
                width="auto"
                height="auto"
                alt=""
              />
            </div>

            <div class="flex-1">
              <AutoGrowTextArea
                v-model="text"
                :max-length="MAX_LENGTH"
                placeholder="What's up?"
                :is-focused="open"
              />
            </div>
          </div>

          <div v-if="images.length" class="grid grid-cols-4 gap-2 mt-3">
            <div
              v-for="img in images"
              :key="img.id"
              class="relative aspect-square rounded-lg overflow-hidden border border-gray-700 group"
            >
              <img
                :src="img.previewUrl"
                class="w-full h-full object-cover"
                alt=""
              />
              <button
                type="button"
                class="absolute top-1 right-1 flex items-center justify-center size-6 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                @click="removeImage(img.id)"
              >
                <Icon name="lucide:x" class="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileChange"
        />

        <div class="flex justify-between items-center p-2 pr-4 border-t border-gray-700">
          <button
            type="button"
            class="flex justify-center items-center size-8 rounded-full cursor-pointer hover:bg-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canAddMoreImages"
            @click="openFilePicker"
          >
            <Icon name="lucide:image" class="size-5 text-blue-500" />
          </button>

          <div class="flex items-center gap-x-3">
            <span v-if="images.length" class="text-xs text-gray-400">
              {{ images.length }}/{{ MAX_IMAGES }}
            </span>

            <p
              class="text-xs"
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
      </div>
    </template>
  </UModal>
</template>