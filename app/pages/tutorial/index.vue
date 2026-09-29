<script lang="ts" setup>
import Tabs from './components/tabs.vue';
import TaskForm from './components/task-form.vue';
import TaskList from './components/task-list.vue';
import type { ActiveTab } from './types/active-tab.ts';
import type { Task } from './types/task.ts';
import { ref, computed } from 'vue';

definePageMeta({
  layout: false
});

const tasks = ref<Task[]>([]);
const totalDone = computed(() =>
  tasks.value.reduce((accumulator, currentValue) => currentValue.done ? accumulator + 1 : accumulator, 0)
);
const activeTab = ref<ActiveTab>("all");
const filteredTasks = computed(() => {
  switch(activeTab.value) {
    case "all": {
      return tasks.value;
    }
    case "todo": {
      return tasks.value.filter((t) => !t.done);
    }
    case "done": {
      return tasks.value.filter((t) => t.done);
    }
  }
});

const addTask = (newTask: string) => {
  tasks.value.push({
    id: crypto.randomUUID(),
    title: newTask,
    done: false,
  });
}

const toggleDone = (id: string) => {
  const task = tasks.value.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
  }
};

const remove = (id: string) => {
  const index = tasks.value.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks.value.splice(index, 1);
  }
};

</script>

<template>
  <main class="max-w-200 mx-auto">
    <h1>
      Vue Tasks App
    </h1>
    <TaskForm
      @add-task="addTask"
    />
    <h3 v-if="tasks.length === 0">
      Add a task to get started
    </h3>
    <h3 v-else>
      {{ totalDone }} / {{ tasks.length }} tasks completed
    </h3>
    <Tabs
      :active-tab="activeTab"
      @update="(tab) => {
        activeTab = tab;
      }"
    />
    <TaskList
      :tasks="filteredTasks"
      @toggle-done="toggleDone"
      @remove="remove"
    />
  </main>
</template>