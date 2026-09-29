<script setup lang="ts">
import type { Task } from '../types/task';
import { cn } from '~/lib/utils';

interface Props {
  tasks: Task[];
}

const props = defineProps<Props>();

const emits = defineEmits<{
  toggleDone: [id: string];
  remove: [id: string];
}>();
</script>

<template>
  <ul>
    <li
      class="flex justify-between p-2 border-b"
      v-for="t in tasks"
      :key="t.id"
    >
      <label :class="cn(
        t.done && 'line-through'
      )">
        <input
          type="checkbox"
          :checked="t.done"
          @input="emits('toggleDone', t.id)"
        />
        {{ t.title }}
      </label>
      <button
        class="flex justify-center items-center size-5 cursor-pointer bg-red-500 text-white"
        @click="emits('remove', t.id)"
      >
        x
      </button>
    </li>
  </ul>
</template>