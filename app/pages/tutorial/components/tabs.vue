<script setup lang="ts">
import type { ActiveTab } from '../types/active-tab';
import { cn } from '~/lib/utils';


interface Props {
  activeTab: ActiveTab;
  
}

const props = defineProps<Props>();
const emits = defineEmits<{
  update: [tab: ActiveTab];
}>();

</script>

<template>
  <div
    class="flex justify-end gap-x-2"
  >
    <button
      class="py-1 px-3 border cursor-pointer"
      :class="cn(
        activeTab === 'all' && 'bg-blue-500',
      )"
      @click="emits('update', 'all')"
    >
      All
    </button>
    <button
      class="py-1 px-3 border cursor-pointer"
      :class="cn(
        activeTab === 'todo' && 'bg-blue-500',
      )"
      @click="emits('update', 'todo')"
    >
      Todo
    </button>
    <button
      class="py-1 px-3 border cursor-pointer"
      :class="cn(
        activeTab === 'done' && 'bg-blue-500',
      )"
      @click="emits('update', 'done')"
    >
      Done
    </button>
  </div>
</template>