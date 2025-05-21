<script setup lang="ts">
const schedules = ref([
  { id: 0, hour: 6, minute: 40, weekday: [false, false, true, false, false, false, false] },
  { id: 1, hour: 7, minute: 50, weekday: [false, true, false, false, false, false, false] },
  { id: 2, hour: 8, minute: 20, weekday: [false, false, false, true, false, false, false] },
  { id: 3, hour: 10, minute: 20, weekday: [true, false, false, false, true, true, true] },
]);
</script>

<template>
  <div class="w-80 pb-13 flex flex-col gap-4">
    <ScheduleItem
      v-for="schedule in schedules"
      :key="schedule.id"
      v-model:hour="schedule.hour"
      v-model:minute="schedule.minute"
      :weekday="schedule.weekday"
    />
    <UButton
      class="fixed bottom-22 left-0 right-0 m-auto w-80 rounded-lg text-2xl justify-center"
      icon="i-lucide-plus"
    />
  </div>
</template>
