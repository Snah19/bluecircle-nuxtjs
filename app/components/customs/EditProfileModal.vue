<!-- app/componets/customs/EditProfileModal.vue -->

<script setup lang="ts">
import type { User } from '@/types/user';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import type { DropdownMenuItem } from "@nuxt/ui";
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

interface Props {
  open: boolean;
  isPending?: boolean;
  user: User;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [open: boolean];
  'update-profile': [payload: {
    fullname: string;
    bio?: string;
    profileImageFile?: File;
    coverImageFile?: File;
    removeProfileImage?: boolean;
    removeCoverImage?: boolean;
  }];
}>();

const toast = useToast();

const fullnameFocused = ref(false);
const bioFocused = ref(false);

const fullnameBlurred = ref(false);
const bioBlurred = ref(false);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const IMAGE_LABELS = {
  profileImageFile: 'Profile',
  coverImageFile: 'Cover',
} as const;

const REMOVE_FIELDS = {
  profileImageFile: 'removeProfileImage',
  coverImageFile: 'removeCoverImage',
} as const;

const imageFileSchema = (label: string) =>
  z
    .instanceof(File)
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), `${label} image must be a JPEG, PNG or WebP file.`)
    .refine(file => file.size <= MAX_IMAGE_SIZE, `${label} image must be 5MB or smaller.`)
    .optional();

const updateProfileSchema = toTypedSchema(
  z.object({
    fullname: z
      .string()
      .trim()
      .min(1, 'Fullname is required.')
      .max(64, 'Fullname is too long. The maximum number of characters is 64.'),
    bio: z
      .string()
      .trim()
      .max(256, 'Bio is too long. The maximum number of characters is 256.')
      .optional(),
    profileImageFile: imageFileSchema(IMAGE_LABELS.profileImageFile),
    coverImageFile: imageFileSchema(IMAGE_LABELS.coverImageFile),
    removeProfileImage: z.boolean().optional(),
    removeCoverImage: z.boolean().optional(),
  }),
);

const { defineField, handleSubmit, errors, resetForm, setFieldValue, meta } = useForm({
  validationSchema: updateProfileSchema,
  initialValues: {
    fullname: props.user.fullname,
    bio: props.user.bio ?? '',
    removeProfileImage: false,
    removeCoverImage: false,
  },
});

const [fullname, fullnameAttrs] = defineField('fullname');
const [bio, bioAttrs] = defineField('bio');
const [profileImageFile] = defineField('profileImageFile');
const [coverImageFile] = defineField('coverImageFile');
const [removeProfileImage] = defineField('removeProfileImage');
const [removeCoverImage] = defineField('removeCoverImage');

const profileInputRef = ref<HTMLInputElement>();
const coverInputRef = ref<HTMLInputElement>();

const onImageChange = (event: Event, field: 'profileImageFile' | 'coverImageFile') => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    const result = imageFileSchema(IMAGE_LABELS[field]).safeParse(file);

    if (result.success) {
      setFieldValue(field, file);
      // Picking a new file cancels any pending removal
      setFieldValue(REMOVE_FIELDS[field], false);
    }
    else {
      toast.add({
        title: 'Invalid image',
        description: result.error.issues[0]?.message,
        color: 'warning',
        icon: 'lucide:triangle-alert',
        progress: false,
      });
    }
  }

  input.value = '';
};

const usePreview = (source: () => File | undefined) => {
  const url = ref<string>();

  watch(source, (value) => {
    if (url.value) {
      URL.revokeObjectURL(url.value);
    }
    url.value = value ? URL.createObjectURL(value) : undefined;
  });

  onBeforeUnmount(() => {
    if (url.value) {
      URL.revokeObjectURL(url.value);
    }
  });

  return url;
};

const profilePreview = usePreview(() => profileImageFile.value as File | undefined);
const coverPreview = usePreview(() => coverImageFile.value as File | undefined);

const removeImage = (field: 'profileImageFile' | 'coverImageFile', hasSavedImage: boolean) => {
  // Drops any newly picked file and its preview
  setFieldValue(field, undefined);
  // Only flag a removal if the server actually has an image
  setFieldValue(REMOVE_FIELDS[field], hasSavedImage);
};

const profileDropdownItems = computed<DropdownMenuItem[]>(() => {
  const hasImage = !!profilePreview.value || (!!props.user.profileImageUrl && !removeProfileImage.value);

  return [
    {
      label: 'Upload',
      icon: 'i-lucide-upload',
      onSelect: () => {
        profileInputRef.value?.click();
      },
    },
    ...(hasImage
      ? [{
          label: 'Remove',
          icon: 'i-lucide-trash',
          onSelect: () => {
            removeImage('profileImageFile', !!props.user.profileImageUrl);
          },
        }]
      : []),
  ];
});

const coverDropdownItems = computed<DropdownMenuItem[]>(() => {
  const hasImage = !!coverPreview.value || (!!props.user.coverImageUrl && !removeCoverImage.value);

  return [
    {
      label: 'Upload',
      icon: 'i-lucide-upload',
      onSelect: () => {
        coverInputRef.value?.click();
      },
    },
    ...(hasImage
      ? [{
          label: 'Remove',
          icon: 'i-lucide-trash',
          onSelect: () => {
            removeImage('coverImageFile', !!props.user.coverImageUrl);
          },
        }]
      : []),
  ];
});

watch(
  () => [props.open, props.user],
  () => {
    if (props.open) {
      resetForm({
        values: {
          fullname: props.user.fullname,
          bio: props.user.bio ?? '',
          profileImageFile: undefined,
          coverImageFile: undefined,
          removeProfileImage: false,
          removeCoverImage: false,
        },
      });
    }
  },
);

const onSubmit = handleSubmit((values) => {
  emit('update-profile', {
    fullname: values.fullname,
    bio: values.bio,
    profileImageFile: values.profileImageFile,
    coverImageFile: values.coverImageFile,
    removeProfileImage: values.removeProfileImage,
    removeCoverImage: values.removeCoverImage,
  });
});
</script>

<template>
  <UModal
    :open="open"
    :dismissible="!isPending"
    :ui="{
      content: 'max-w-150 rounded-lg ring ring-gray-700 bg-gray-900',
      overlay: 'bg-black/70'
    }"
    @update:open="emit('update:open', $event)"
  >
    <template #content>
      <form @submit.prevent="onSubmit">
        <input
          ref="profileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onImageChange($event, 'profileImageFile')"
        />
        <input
          ref="coverInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onImageChange($event, 'coverImageFile')"
        />

        <div class="flex justify-between items-center py-2 px-4 border-b border-gray-700">
          <button
            type="button"
            class="text-sm cursor-pointer text-blue-500 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isPending"
            @click="emit('update:open', false)"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="inline-flex items-center gap-x-2 py-2 px-4 text-sm rounded-full cursor-pointer bg-blue-500 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isPending || !meta.dirty"
          >
            Save
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="size-4 animate-spin"
            />
          </button>
        </div>

        <div class="relative mb-4">
          <div class="h-37.5 bg-gray-800">
            <img
              v-if="coverPreview || (user.coverImageUrl && !removeCoverImage)"
              class="size-full object-cover"
              :src="coverPreview || (user.coverImageUrl ?? '')"
            />
          </div>

          <div class="absolute left-4 -bottom-4">
            <div class="relative size-20 border border-gray-500 rounded-full overflow-hidden bg-gray-800">
              <img
                class="size-full object-cover"
                :src="profilePreview || (!removeProfileImage && user.profileImageUrl) || defaultProfile"
              />
            </div>

            <UDropdownMenu
              :items="profileDropdownItems"
              :content="{ align: 'end', side: 'bottom' }"
              :ui="{
                content: 'w-fit bg-gray-800',
                item: 'cursor-pointer data-highlighted:rounded data-highlighted:bg-gray-700'
              }"
            >
              <button
                type="button"
                class="absolute bottom-0 right-0 flex justify-center items-center size-6 rounded-full border border-gray-500 cursor-pointer bg-gray-900 hover:bg-gray-700"
              >
                <Icon
                  name="lucide:camera"
                  class="size-4"
                />
              </button>
            </UDropdownMenu>
          </div>

          <UDropdownMenu
            :items="coverDropdownItems"
            :content="{ align: 'end', side: 'bottom' }"
            :ui="{
              content: 'w-fit bg-gray-800',
              item: 'cursor-pointer data-highlighted:rounded data-highlighted:bg-gray-700'
            }"
          >
            <button
              type="button"
              class="absolute bottom-4 right-4 flex justify-center items-center size-6 rounded-full border border-gray-500 cursor-pointer bg-gray-900 hover:bg-gray-700"
            >
              <Icon
                name="lucide:camera"
                class="size-4"
              />
            </button>
          </UDropdownMenu>
        </div>

        <div class="space-y-4 p-4">
          <div class="space-y-2">
            <label
              for="fullname"
              class="block text-sm font-medium text-slate-300"
            >
              Fullname
            </label>
            <div
              :class="cn(
                'flex items-center gap-2 p-2 rounded-lg border border-transparent transition-colors group bg-gray-800',
                fullnameFocused && 'border-blue-500',
                errors.fullname && 'border-red-500',
              )"
            >
              <input
                id="fullname"
                v-model="fullname"
                type="text"
                class="w-full bg-transparent placeholder:text-gray-400 outline-none"
                placeholder="e.g. John Doe"
                @focus="fullnameFocused = true"
                @blur="
                  fullnameFocused = false;
                  fullnameBlurred = true;
                  fullnameAttrs.onBlur();
                "
              />
            </div>
            <p
              v-if="errors.fullname"
              class="text-xs text-red-500"
            >
              {{ errors.fullname }}
            </p>
          </div>

          <div class="space-y-2">
            <label
              for="bio"
              class="block text-sm font-medium text-slate-300"
            >
              Bio
            </label>
            <div
              :class="cn(
                'flex items-center gap-2 p-2 rounded-lg border border-transparent transition-colors group bg-gray-800',
                bioFocused && 'border-blue-500',
                errors.bio && 'border-red-500',
              )"
            >
              <textarea
                id="bio"
                v-model="bio"
                rows="4"
                class="w-full bg-transparent placeholder:text-gray-400 outline-none"
                placeholder="Tell us a bit about yourself"
                @focus="bioFocused = true"
                @blur="
                  bioFocused = false;
                  bioBlurred = true;
                  bioAttrs.onBlur();
                "
              />
            </div>
            <p
              v-if="errors.bio"
              class="text-xs text-red-500"
            >
              {{ errors.bio }}
            </p>
          </div>
        </div>
      </form>
    </template>
  </UModal>
</template>