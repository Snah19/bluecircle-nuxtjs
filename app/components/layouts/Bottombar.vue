<!-- app/components/layouts/Bottombar.vue -->

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
  <ul class="z-50 fixed bottom-0 grid min-[800px]:hidden grid-cols-5 place-items-center min-[1300px]:hidden w-full py-2 px-4 border-t border-gray-700 bg-gray-900">
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
            {{ unreadNotifications.total }}
          </span>
        </div>

        <span class="hidden min-[1300px]:flex">
          {{ l.label }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>