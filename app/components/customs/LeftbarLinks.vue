<!-- app.components/customs/LeftbarLinks.vue -->

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { meQuery } from '@/queries/me.query';
import type { LeftbarLink } from '@/types/leftbar-link';
import { unreadNotificationsQuery } from '~/queries/unread-notifications.query';

const route = useRoute();
const { data: me } = useQuery(meQuery());
const { data: unreadNotifications } = useQuery(unreadNotificationsQuery());

const leftbarLinks = computed<LeftbarLink[]>(() => [
  {
    label: 'Home',
    icon: 'solar:home-linear',
    iconActive: 'solar:home-bold',
    href: '/',
    active: route.path === '/',
  },
  {
    label: 'Search',
    icon: 'solar:magnifer-linear',
    iconActive: 'solar:magnifer-bold',
    href: '/search',
    active: route.path === '/search',
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
  <ul class="min-[1300px]:w-full space-y-2">
    <li
      v-for="l in leftbarLinks"
      :key="l.label"
    >
      <NuxtLink
        :to="l.href"
        class="flex items-center gap-3 w-fit min-[1300px]:w-full p-2 rounded-full cursor-pointer hover:bg-gray-800"
        :class="cn(
          l.active && 'font-bold'
        )"
      >
        <div class="relative">
          <Icon
            :name="l.icon"
            :class="cn(
              'relative text-2xl size-6 shrink-0',
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

          <span
            v-if="l.label === 'Notifications' && unreadNotifications?.total && unreadNotifications?.total > 0"
            class="absolute -top-1 -right-1 flex justify-center items-center text-xs size-4 rounded-full bg-blue-500"
          >
            {{ `${unreadNotifications.total > 99 ? '99' : unreadNotifications.total}`  }}

            <span
              v-if="unreadNotifications?.total > 99"
              class="absolute -top-2 -right-1 text-xs"
            >
              +
            </span>
          </span>
        </div>

        <span class="hidden min-[1300px]:flex">
          {{ l.label }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>