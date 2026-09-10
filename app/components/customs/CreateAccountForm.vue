<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { cn } from '~/lib/utils';

interface Props {
  isPending?: boolean;
  errorMessage: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  back: [];
  createAccount: [
    payload: {
      username: string;
      fullname: string;
      email: string;
      password: string;
    },
  ];
}>();

const usernameFocused = ref(false);
const fullnameFocused = ref(false);
const emailFocused = ref(false);
const passwordFocused = ref(false);

const usernameBlurred = ref(false);
const fullnameBlurred = ref(false);
const emailBlurred = ref(false);
const passwordBlurred = ref(false);

const createAccountSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(1, "Enter a username to continue")
      .min(4, "Your username must be at least 4 characters")
      .max(15, "Your username must be shorter than 15 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "The username can only contain letters, numbers, and underscores"),
    fullname: z
      .string()
      .min(1, "Enter your name to continue")
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be shorter than 50 characters"),
    email: z
      .email("That doesn't look like a valid email")
      .min(1, "Enter an email to continue"),
    password: z
      .string()
      .min(1, "Enter a password to continue")
      .min(8, "Needs at least 8 characters"), 
  }),
);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: createAccountSchema,
  initialValues: {
    username: '',
    fullname: '',
    email: '',
    password: '',
  },
});

const [username, usernameAttrs] = defineField('username');
const [fullname, fullnameAttrs] = defineField('fullname');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(
  (values) => {
    emit('createAccount', values);
  },
  () => {
    usernameBlurred.value = true;
    fullnameBlurred.value = true;
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
        for="username"
        class="block text-sm font-medium text-slate-300"
      >
        Username
      </label>
      <div
        :class="cn(
          'flex items-center gap-2 p-2 rounded-xl border transition-colors group bg-gray-800',
          usernameFocused && 'border-blue-500',
          !usernameFocused && (usernameBlurred && errors.username) && 'border-red-500',
          !usernameFocused && !(usernameBlurred && errors.username) && 'border-transparent hover:border-gray-400',
        )"
      >
        <Icon
          name="lucide:at-sign"
          :class="cn(
            'size-5 shrink-0 transition-colors',
            usernameFocused && 'text-blue-500',
            !usernameFocused && (usernameBlurred && errors.username) && 'text-red-500',
            !usernameFocused && !(usernameBlurred && errors.username) && 'text-gray-600 group-hover:text-gray-400',
          )"
        />
        <input
          id="username"
          v-model="username"
          v-bind="usernameAttrs"
          type="text"
          class="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none"
          :disabled="isPending"
          @focus="usernameFocused = true"
          @blur="
            usernameFocused = false;
            usernameBlurred = true;
            usernameAttrs.onBlur();
          "
        />
      </div>
      <p class="text-xs text-red-500">
        {{ errors.username }}
      </p>
    </div>

    <div class="space-y-2">
      <label
        for="fullname"
        class="block text-sm font-medium text-slate-300"
      >
        Full name
      </label>
      <div
        :class="cn(
          'flex items-center gap-2 p-2 rounded-xl border transition-colors group bg-gray-800',
          fullnameFocused && 'border-blue-500',
          !fullnameFocused && (fullnameBlurred && errors.fullname) && 'border-red-500',
          !fullnameFocused && !(fullnameBlurred && errors.fullname) && 'border-transparent hover:border-gray-400',
        )"
      >
        <Icon
          name="lucide:user"
          :class="cn(
            'size-5 shrink-0 transition-colors',
            fullnameFocused && 'text-blue-500',
            !fullnameFocused && (fullnameBlurred && errors.fullname) && 'text-red-500',
            !fullnameFocused && !(fullnameBlurred && errors.fullname) && 'text-gray-600 group-hover:text-gray-400',
          )"
        />
        <input
          id="fullname"
          v-model="fullname"
          v-bind="fullnameAttrs"
          type="text"
          class="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none"
          :disabled="isPending"
          @focus="fullnameFocused = true"
          @blur="
            fullnameFocused = false;
            fullnameBlurred = true;
            fullnameAttrs.onBlur();
          "
        />
      </div>
      <p class="text-xs text-red-500">
        {{ errors.fullname }}
      </p>
    </div>

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
          name="lucide:mail"
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
      <p class="text-xs text-red-500">
        {{ errors.email }}
      </p>
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
          name="lucide:lock"
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
      <p class="text-xs text-red-500">
        {{ errors.password }}
      </p>
    </div>

    <p
      v-if="errorMessage"
      class="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-2 text-sm text-red-500"
    >
      <Icon
        name="lucide:circle-x"
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
          Create Account
        </span>
        <Icon
          v-if="isPending"
          name="lucide:loader-circle"
          class="size-4 animate-spin"
        />
      </button>
    </div>  
  </form>
</template>