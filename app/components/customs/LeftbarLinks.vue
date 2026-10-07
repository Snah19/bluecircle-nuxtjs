<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { leftbarLinks } from '@/constants/leftbar-links';
import { meQuery } from '@/queries/me.query';

const activeLabel = defineModel<string>('activeLabel', { required: true });

const { data: me } = useQuery(meQuery());
</script>

<template>
  <ul class="space-y-2">
    <li
      v-for="l in leftbarLinks"
      :key="l.label"
    >
      <NuxtLink
        :to="l.label === 'Profile' ? `/profile/${me?.username}` : l.href"
        class="flex items-center gap-3 w-full p-2 rounded-full cursor-pointer hover:bg-gray-800"
        :class="cn(
          activeLabel === l.label && 'font-bold'
        )"
        @click="activeLabel = l.label"
      >
        <Icon
          :name="l.icon"
          :class="cn(
            'text-2xl size-6 shrink-0',
            activeLabel !== l.label ? 'block' : 'hidden',
          )"
        />
        <Icon
          :name="l.iconActive"
          :class="cn(
            'text-2xl size-6 shrink-0',
            activeLabel === l.label ? 'block' : 'hidden'
          )"
        />
        <span>
          {{ l.label }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>