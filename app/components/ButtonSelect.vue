<script setup lang="ts" generic="T">
type ButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
type ButtonVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link';

withDefaults(defineProps<{
  modelValue: T;
  options: {
    label: string
    value: T
  }[];
  onColor?: ButtonColor;
  offColor?: ButtonColor;
  onVariant?: ButtonVariant;
  offVariant?: ButtonVariant;
}>(), {
  onColor: 'primary',
  offColor: 'neutral',
  onVariant: 'subtle',
  offVariant: 'outline'
})

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <UFieldGroup>
    <UButton
      v-for="(option, i) in options"
      :key="i"
      :color="modelValue === option.value ? onColor : offColor"
      :variant="modelValue === option.value ? onVariant : offVariant"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </UButton>
  </UFieldGroup>
</template>
