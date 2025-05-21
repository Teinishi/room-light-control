<script setup lang="ts">
const hour_list = [...range(0, 24, 1)];
const minute_list = [...range(0, 60, 1)];

defineProps<{
  hour: number,
  minute: number
}>();

const emit = defineEmits(['update:hour', 'update:minute']);
</script>

<template>
  <div class="select-none flex items-center">
    <NumberPicker :model-value="hour" :items="hour_list" :padding="2" @update:model-value="(v: number | undefined) => emit('update:hour', v)" />
    <div class="h-16 text-5xl flex items-center">:</div>
    <NumberPicker :model-value="minute" :items="minute_list" :padding="2" @update:model-value="(v: number | undefined) => emit('update:minute', v)" />
  </div>
</template>
