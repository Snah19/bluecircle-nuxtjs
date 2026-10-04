<script setup lang="ts">
interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'confirm': [];
  'cancel': [];
}>();
</script>

<template>
  <UModal
    :open="open"
    :ui="{
      content: 'max-w-xs rounded-4xl ring ring-gray-700 bg-gray-800',
      overlay: 'bg-black/70'
    }"
    @update:open="emit('cancel')"    
  >
    <template #content>
      <div class="p-6 flex flex-col gap-y-5">
        <div>
          <h2 class="text-lg font-bold text-white">
            {{ title }}
          </h2>
          <p class="text-sm text-gray-400 mt-1">
            {{ message }}
          </p>
        </div>

        <div class="flex flex-col gap-y-2">
          <button
            class="h-11 font-medium rounded-full cursor-pointer transition-colors bg-red-700 hover:bg-red-600 text-white"            
            @click="emit('confirm')"
          >
            {{ confirmButtonText }}
          </button>

          <button
            class="h-11 font-medium rounded-full cursor-pointer transition-colors bg-gray-700 hover:bg-gray-600 text-white"
            @click="emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </template>
  </UModal>

</template>