<!-- app.components/customs/LeftbarLinks.vue -->

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { meQuery } from '@/queries/me.query';
import type { LeftbarLink } from '@/types/leftbar-link';

const route = useRoute();
const { data: me } = useQuery(meQuery());

const leftbarLinks = computed<LeftbarLink[]>(() => [
  {
    label: 'Home',
    icon: 'solar:home-linear',
    iconActive: 'solar:home-bold',
    href: '/',
    active: route.path === '/',
  },
  {
    label: 'Notifications',
    icon: 'solar:bell-linear',
    iconActive: 'solar:bell-bold',
    href: '/notifications',
    active: route.path === '/notifications',
  },
  {
    label: 'Saved',
    icon: 'solar:bookmark-linear',
    iconActive: 'solar:bookmark-bold',
    href: '/saved',
    active: route.path === '/saved',
  },
  {
    label: 'Profile',
    icon: 'solar:user-linear',
    iconActive: 'solar:user-bold',
    href: `/profile/${me.value?.username}`,
    active: !!me.value?.username && route.params.username === me.value.username,
  },
]);
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
        :class="cn(
          l.active && 'font-bold'
        )"
      >
        <Icon
          :name="l.icon"
          :class="cn(
            'text-2xl size-6 shrink-0',
            !l.active ? 'block' : 'hidden',
          )"
        />
        <Icon
          :name="l.iconActive"
          :class="cn(
            'text-2xl size-6 shrink-0',
            l.active ? 'block' : 'hidden'
          )"
        />
        <span>
          {{ l.label }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>