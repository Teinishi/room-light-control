<script setup lang="ts">
const props = defineProps<{
  modelValue: number | number[],
  disabled?: boolean
}>();

const emit = defineEmits(['update:modelValue']);

function updateModelValue(selected, value) {
  if (Array.isArray(props.modelValue)) {
    emit('update:modelValue', selected ? [...props.modelValue, value] : props.modelValue.filter(v => v !== value));
  } else if (selected) {
    emit('update:modelValue', value);
  }
}
</script>

<template>
  <div class="grid grid-cols-7 gap-1">
    <UCheckbox
      v-for="(name, index) in WEEKDAYS"
      :key="index"
      :label="name"
      :model-value="Array.isArray(modelValue) ? modelValue.includes(index) : modelValue === index"
      :disabled="disabled"
      indicator="hidden"
      variant="card"
      class="p-1 aspect-square flex items-center"
      @update:model-value="s => updateModelValue(s, index)"
    />
  </div>
</template>
