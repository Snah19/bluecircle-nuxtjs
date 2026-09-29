<script setup lang="ts">
interface Props {
  modelValue: string;
  maxLength?: number;
  placeholder?: string;
  isFocused?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: undefined,
  placeholder: undefined,
  isFocused: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const computedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const autoGrow = () => {
  const el = textareaRef.value;
  if (!el) return;

  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  let value = target.value;

  if (props.maxLength && value.length > props.maxLength) {
    value = value.slice(0, props.maxLength);
  }

  computedValue.value = value;
  autoGrow();
};

watch(
  () => props.modelValue,
  () => nextTick(autoGrow)
);

watch(
  () => props.isFocused,
  (shouldFocus) => {
    if (shouldFocus) nextTick(() => textareaRef.value?.focus());
  }
);

onMounted(() => {
  nextTick(autoGrow);
  if (props.isFocused) nextTick(() => textareaRef.value?.focus());
});
</script>

<template>
  <textarea
    ref="textareaRef"
    :value="computedValue"
    rows="1"
    :maxlength="maxLength"
    :placeholder="placeholder"
    class="w-full outline-none bg-transparent placeholder:text-gray-400 placeholder:text-sm resize-none overflow-hidden"
    @input="handleInput"
  />
</template>