<script setup lang="ts">
import { ref } from 'vue';
const newTask = ref("");
const error = ref("");

const emit = defineEmits<{
  addTask: [newTask: string];
}>();

const handleSubmit = () => {
  if (!newTask.value.trim()) {
    error.value = "Task cannot be empty!";
    return;
  }

  emit('addTask', newTask.value.trim());
  newTask.value = "";
};

</script>

<template>
    <form
      class="flex justify-between items-start gap-x-2 mb-10"
      @submit.prevent="handleSubmit"
    >
      <div class="w-full">
        <input
          class="w-full p-2 border"
          name="newTask"
          v-model="newTask"
          @input="error = ''"
        >
        <p
          v-if="error"
          class="text-red-500"
        >
          {{ error }}
        </p>
      </div>
      <button
        class="p-2 border cursor-pointer"
      >
        Add
      </button>
    </form>
</template>