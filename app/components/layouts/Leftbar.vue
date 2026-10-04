<!-- app/components/layouts/Leftbar.vue -->

<script setup lang="ts">
import { signOut } from '~/functions/sign-out.ts';
import Account from '../customs/Account.vue';
import JoinTheConversation from '../customs/JoinTheConversation.vue';
import LeftbarLinks from '../customs/LeftbarLinks.vue';
import { leftbarLinks } from '~/constants/leftbar-links';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { meQuery } from '~/queries/me.query';

const queryClient = useQueryClient();
const route = useRoute();

const tokenCookie = useCookie<string | null>('auth_token');

const activeLabel = ref("Home");

watchEffect(() => {
  const currentLink = leftbarLinks.find((link) => link.href === route.path);
  if (currentLink) {
    activeLabel.value = currentLink.label;
  }
});

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
  <aside class="sticky top-0 self-start min-w-60 min-h-screen p-4 border-r border-gray-700">
    <div v-if="me">
      <div class="mb-3">
        <Account
          :me="me"
          @go-to-profile="() => { console.log('go to profile'); }"
          @add-another-account="() => { console.log('add another account'); }"
          @sign-out="() => { signoutMutation.mutate(); }"
        />
      </div>
      <div>
        <LeftbarLinks
          v-model:active-label="activeLabel"
        />
      </div>
    </div>

    <div v-if="!me">
      <JoinTheConversation />
    </div>
  </aside>
</template>