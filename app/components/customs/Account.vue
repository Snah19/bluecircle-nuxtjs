<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { User } from "~/types/user";
import SignOutModal from "./SignOutModal.vue";

interface Props {
  me: User
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "go-to-profile": [];
  "add-another-account": [];
  "sign-out": [];
}>();

const signOutModalOpen = ref(false);

const items = ref<DropdownMenuItem[]>(
  [
    {
      label: 'Go to profile',
      icon: 'i-lucide-user',
      onSelect: () => {
        emit("go-to-profile");
      },
    },
    {
      label: 'Add another account',
      icon: 'i-lucide-plus',
      onSelect: () => {
        emit("add-another-account");
      }
    },
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      onSelect: () => {
        signOutModalOpen.value = true;
      }
    }
  ],
);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'start', side: 'top' }"
    :ui="{
      content: 'w-(--reka-dropdown-menu-trigger-width) bg-gray-800',
      item: 'cursor-pointer data-highlighted:rounded data-highlighted:bg-gray-700'
    }"
  >
    <template #default="{ open }">
      <button
        class="flex items-center gap-x-2 w-full h-12 px-2 rounded-full group cursor-pointer hover:bg-gray-800 overflow-hidden"
        :class="{ 'bg-gray-800': open }"
      >
        <div
          :class="[
            'shrink-0 border border-gray-500 rounded-full overflow-hidden transition-[width,height]',
            open ? 'size-8' : 'size-12 group-hover:size-8'
          ]"
        >
          <img
            class="w-full h-full object-cover"
            :src="me?.profileImageUrl"
            width="auto"
            height="auto"
            alt=""
          />
        </div>

        <div class="flex gap-x-2 justify-between items-center w-full min-w-0">
          <div class="flex flex-col items-start w-full min-w-0 overflow-hidden">
            <p
              class="w-full max-w-full text-sm text-left whitespace-nowrap overflow-hidden text-ellipsis"
              :class="open ? 'block' : 'hidden group-hover:block'"
            >
              {{ me?.fullname }}
            </p>
            <p
              class="w-full max-w-full text-xs text-left whitespace-nowrap overflow-hidden text-ellipsis"
              :class="open ? 'block' : 'hidden group-hover:block'"
            >
              @{{ me?.username }}
            </p>
          </div>

          <Icon
            name="solar:menu-dots-bold"
            class="text-xl shrink-0"
            :class="open ? 'block' : 'hidden group-hover:block'"
          />
        </div>
      </button>
    </template>
  </UDropdownMenu>

  <SignOutModal
    v-model:open="signOutModalOpen"
    @confirm="emit('sign-out')"
  />
</template>