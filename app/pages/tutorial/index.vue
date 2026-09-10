<script setup>
definePageMeta({
  layout: false
})

const emoji = ref("🙈");
const statusCode = ref("500");
const statusMessage = ref("Server is sleeping...");
const buttonText = ref("Click Me");
</script>

<template>
  <main class="w-full min-h-screen">
    <span>
      {{ emoji }}
    </span>

    <h1>
      {{ statusCode }}
    </h1>

    <p>
      {{ statusMessage }}
    </p>

    <button>
      {{ buttonText }}
    </button>
  </main>
</template>