<!-- app/components/customs/ImageLightbox.vue -->

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Props {
  open: boolean;
  imageUrls: string[];
  initialIndex: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const current = ref(props.initialIndex);

watch(
  () => [props.open, props.initialIndex] as const,
  ([open, index]) => {
    if (open) current.value = index;
  },
);

const hasPrev = computed(() => current.value > 0);
const hasNext = computed(() => current.value < props.imageUrls.length - 1);

const prev = () => { if (hasPrev.value) current.value--; };
const next = () => { if (hasNext.value) current.value++; };

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
};

watch(
  () => props.open,
  (open) => {
    if (open) window.addEventListener('keydown', onKeydown);
    else window.removeEventListener('keydown', onKeydown);
  },
);

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/95"
        @click="emit('close')"
      >
        <img
          :src="imageUrls[current]"
          alt=""
          class="max-h-full max-w-full object-contain"
          @click.stop
        />

        <div
          v-if="imageUrls.length > 1"
          class="absolute top-4 left-1/2 -translate-x-1/2 flex gap-x-1 rounded-full bg-black/60 px-2 py-1"
          @click.stop
        >
          <button
            v-for="(_, i) in imageUrls"
            :key="i"
            type="button"
            class="flex size-4 items-center justify-center cursor-pointer"
            :aria-label="`Go to image ${i + 1}`"
            @click.stop="current = i"
          >
            <span
              class="size-1.5 rounded-full transition-colors"
              :class="i === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'"
            />
          </button>
        </div>

        <button
          class="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full cursor-pointer bg-black/60 text-white"
          @click.stop="emit('close')"
        >
          <Icon name="lucide:x" class="size-5" />
        </button>

        <button
          v-if="hasPrev"
          class="absolute left-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full cursor-pointer bg-black/60 text-white"
          @click.stop="prev"
        >
          <Icon name="lucide:chevron-left" class="size-5" />
        </button>

        <button
          v-if="hasNext"
          class="absolute right-4 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full cursor-pointer bg-black/60 text-white"
          @click.stop="next"
        >
          <Icon name="lucide:chevron-right" class="size-5" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>