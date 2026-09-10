<script setup lang="ts">
import { leftbarLinks } from '~/constants/leftbar-links';

const activeLabel = defineModel<string>('activeLabel', { required: true });
</script>

<template>
  <ul class="space-y-2">
    <li
      v-for="l in leftbarLinks"
      :key="l.label"
    >
      <NuxtLink
        :to="l.href"
        class="flex items-center gap-3 w-full p-2 rounded-full cursor-pointer hover:bg-gray-800"
        :class="{ 'font-bold': activeLabel === l.label }"
        @click="activeLabel = l.label"
      >
        <Icon
          :name="activeLabel === l.label ? l.iconActive : l.icon"
          class="text-2xl size-6 shrink-0"
        />
        <span>
          {{ l.label }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>