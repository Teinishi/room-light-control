<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'

defineProps<{
  disabled?: boolean
}>();

const modelValue = defineModel<{
  start: CalendarDate,
  end: CalendarDate
}>();

const inputDate = useTemplateRef('inputDate');
</script>

<template>
  <UInputDate ref="inputDate" v-model="modelValue" range :disabled="disabled">
    <template #trailing>
      <UPopover :reference="inputDate?.inputsRef[0]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date range"
          class="px-0"
          :disabled="disabled"
        />

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>

