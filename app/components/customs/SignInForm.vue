<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { cn } from '~/utils/cn';

interface Props {
  isPending?: boolean;
  errorMessage: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  back: [];
  signIn: [payload: { email: string; password: string; }];
}>();

const emailFocused = ref(false);
const passwordFocused = ref(false);

const emailBlurred = ref(false);
const passwordBlurred = ref(false);

const signInSchema = toTypedSchema(
  z.object({
    email: z
      .email("That doesn't look like a valid email")
      .min(1, "Enter an email to continue"),
    password: z
      .string()
      .min(1, "Enter your password to continue")
      .min(8, "Needs at least 8 characters"),
  }),
);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: signInSchema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(
  (values) => {
    emit('signIn', values);
  },
  () => {
    emailBlurred.value = true;
    passwordBlurred.value = true;
  }
);
</script>

<template>
  <form
    class="w-full space-y-4 rounded-2xl"
    @submit.prevent="onSubmit"
  >
    <div class="space-y-2">
      <label
        for="email"
        class="block text-sm font-medium text-slate-300"
      >
        Email
      </label>
      <div
        :class="cn(
          'flex items-center gap-2 p-2 rounded-xl border transition-colors group bg-gray-800',
          emailFocused && 'border-blue-500',
          !emailFocused && (emailBlurred && errors.email) && 'border-red-500',
          !emailFocused && !(emailBlurred && errors.email) && 'border-transparent hover:border-gray-400',
        )"
      >
        <Icon
          name="solar:letter-linear"
          :class="cn(
            'size-5 shrink-0 transition-colors',
            emailFocused && 'text-blue-500',
            !emailFocused && (emailBlurred && errors.email) && 'text-red-500',
            !emailFocused && !(emailBlurred && errors.email) && 'text-gray-600 group-hover:text-gray-400',
          )"
        />
        <input
          id="email"
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          class="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none"
          :disabled="isPending"
          @focus="emailFocused = true"
          @blur="
            emailFocused = false;
            emailBlurred = true;
            emailAttrs.onBlur();
          "
        />
      </div>
    </div>

    <div class="space-y-2">
      <label
        for="password"
        class="block text-sm"
      >
        Password
      </label>
      <div
        :class="cn(
          'flex items-center gap-2 p-2 rounded-xl border transition-colors group bg-gray-800',
          passwordFocused && 'border-blue-500',
          !passwordFocused && (passwordBlurred && errors.password) && 'border-red-500',
          !passwordFocused && !(passwordBlurred && errors.password) && 'border-transparent hover:border-gray-400',
        )"
      >
        <Icon
          name="solar:lock-password-linear"
          :class="cn(
            'size-5 shrink-0 transition-colors',
            passwordFocused && 'text-blue-500',
            !passwordFocused && (passwordBlurred && errors.password) && 'text-red-500',
            !passwordFocused && !(passwordBlurred && errors.password) && 'text-gray-600 group-hover:text-gray-400',
          )"
        />
        <input
          id="password"
          v-model="password"
          v-bind="passwordAttrs"
          type="password"
          class="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none"
          :disabled="isPending"
          @focus="passwordFocused = true"
          @blur="
            passwordFocused = false;
            passwordBlurred = true;
            passwordAttrs.onBlur();
          "
        />
      </div>
    </div>

    <p
      v-if="errorMessage"
      class="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-2 text-sm text-red-500"
    >
      <Icon
        name="solar:close-circle-bold"
        class="size-5 shrink-0"
      />
      {{ errorMessage }}
    </p>

    <div class="flex justify-end items-center gap-x-4">
      <button
        type="button"
        class="py-2 px-4 text-sm rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700"
        :disabled="isPending"
        @click="emit('back')"
      >
        Back
      </button>

      <button
        type="submit"
        :disabled="isPending"
        class="py-2 px-4 text-sm rounded-full cursor-pointer bg-blue-700 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>
          Sign in
        </span>
        <Icon
          v-if="isPending"
          name="svg-spinners:180-ring"
          class="size-4"
        />
      </button>
    </div>
  </form>
</template>