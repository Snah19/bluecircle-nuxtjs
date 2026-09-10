<script setup lang="ts">
interface Props {
  open: boolean
}

defineProps<Props>();

const emit = defineEmits<{
  "update:open": [open: boolean];
  "confirm": [];
}>()

</script>

<template>
  <UModal
    :open="open"
    :ui="{
      content: 'max-w-xs rounded-4xl ring ring-gray-700 bg-gray-800',
      overlay: 'bg-black/70'
    }"
    @update:open="emit('update:open', $event)"
  >
    <template #content>
      <div class="p-6 flex flex-col gap-y-5">
        <div>
          <h2 class="text-lg font-bold text-white">
            Sign out?
          </h2>
          <p class="text-sm text-gray-400 mt-1">
            You will be signed out of all your accounts.
          </p>
        </div>

        <div class="flex flex-col gap-y-2">
          <button
            class="h-11 font-medium rounded-full cursor-pointer transition-colors bg-red-700 hover:bg-red-600 text-white"            
            @click="() => {
              emit('confirm');
              emit('update:open', false);
            }"
          >
            Sign out
          </button>

          <button
            class="h-11 font-medium rounded-full cursor-pointer transition-colors bg-gray-700 hover:bg-gray-600 text-white"
            @click="emit('update:open', false)"
          >
            Cancel
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>