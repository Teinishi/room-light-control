<script setup lang="ts">
defineProps<{
  hour: number,
  minute: number,
  numberInput?: boolean
}>();

const emit = defineEmits(['update:hour', 'update:minute']);

function updateHour(v: number | undefined) {
  emit('update:hour', v);
}

function updateMinute(v: number | undefined) {
  emit('update:minute', v);
}
</script>

<template>
  <div class="select-none flex items-center">
    <template v-if="numberInput">
      <UInputNumber
        :model-value="hour"
        :min="0"
        :max="23"
        size="xl"
        class="w-32 text-5xl"
        @update:model-value="updateHour"
      />
      <div class="h-16 mx-4 text-2xl flex items-center">:</div>
      <UInputNumber
        ref="minuteInput"
        :model-value="minute"
        :min="0"
        :max="59"
        size="xl"
        class="w-32 text-5xl"
        @update:model-value="updateMinute"
      />
    </template>
    <template v-else>
      <NumberPicker
        :model-value="hour"
        :range="[0, 23]"
        @update:model-value="updateHour"
      />
      <div class="h-16 text-5xl flex items-center">:</div>
      <NumberPicker
        :model-value="minute"
        :range="[0, 59]"
        :padding="2"
        @update:model-value="updateMinute"
      />
    </template>
  </div>
</template>
