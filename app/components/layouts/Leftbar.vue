<!-- app/components/layouts/Leftbar.vue -->

<script setup lang="ts">
import { signOut } from '~/functions/sign-out.ts';
import Account from '../customs/Account.vue';
import JoinTheConversation from '../customs/JoinTheConversation.vue';
import LeftbarLinks from '../customs/LeftbarLinks.vue';

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { meQuery } from '~/queries/me.query';

const queryClient = useQueryClient();

const tokenCookie = useCookie<string | null>('auth_token');

if (import.meta.server) {
  await queryClient
    .query(meQuery())
    .catch(() => {});
}

const { data: me } = useQuery(
  computed(() => meQuery())
);

const signoutMutation = useMutation({
  mutationFn: signOut,
  onSuccess: () => {
    tokenCookie.value = null;
    queryClient.clear();
    window.location.href = '/';
  },
  onError: (error: any) => {
    console.error('Sign out failed:', error?.data?.message || error.message);
    tokenCookie.value = null;
    queryClient.clear();
    window.location.href = '/';
  },
});
</script>

<template>
  <aside class="sticky top-0 self-start hidden min-[800px]:block min-w-20 min-[1300px]:min-w-60 min-h-screen border-r border-gray-700">
    <div
      v-if="me"
      class="flex flex-col items-center min-[1300px]:items-start gap-y-3 p-4 pl-0"
    >
      <Account
        :me="me"
        @go-to-profile="navigateTo(`/profile/${me.username}`)"
        @sign-out="() => { signoutMutation.mutate(); }"
      />
      <LeftbarLinks />
    </div>

    <JoinTheConversation v-if="!me" />
  </aside>
</template>