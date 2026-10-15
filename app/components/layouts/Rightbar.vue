<!-- app/components/layouts/Rightbar.vue -->

<script setup lang="ts">
const urlTerm = useSearchTerm();

// Local draft: what the user is typing before they submit
const term = ref(urlTerm.value);

// Keep the input in sync when the URL changes from somewhere else
// (back/forward buttons, clicking a hashtag link, leaving the search page)
watch(urlTerm, (value) => {
  term.value = value;
});

const submit = () => {
  const value = term.value.trim();
  if (!value) return;

  navigateTo({ path: '/search', query: { query: value } });
};
</script>

<template>
  <aside class="sticky top-0 self-start min-w-82.5 min-h-screen p-4 border-l border-gray-700">
    <form
      class="flex overflow-hidden rounded-lg border border-gray-700"
      @submit.prevent="submit"
    >
      <input
        v-model="term"
        name="query"
        :class="cn(
          'min-w-0 p-2 focus-within:outline-0'
        )"
        placeholder="Search"
        autocomplete="off"
      />
      <button
        type="submit"
        class="shrink-0 flex justify-center items-center px-4 cursor-pointer bg-gray-700 hover:bg-gray-600"
      >
        <Icon name="lucide:search" />
      </button>
    </form>
  </aside>
</template>