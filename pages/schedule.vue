<script setup lang="ts">
/*const schedules = ref([
  { id: 0, hour: 6, minute: 40, weekday: [2] },
  { id: 1, hour: 7, minute: 50, weekday: [1] },
  { id: 2, hour: 8, minute: 20, weekday: [3] },
  { id: 3, hour: 10, minute: 20, weekday: [0, 4, 5, 6] },
]);*/

const schedules = await useFetch('/api/schedules');
</script>

<template>
  <div class="w-80 pb-13 flex flex-col gap-4">
    <ScheduleItem
      v-for="schedule in schedules.data.value?.schedules"
      :key="schedule.id"
      v-model:hour="schedule.hour"
      v-model:minute="schedule.minute"
      v-model:weekdays="schedule.weekdays"
    />
    <UButton
      class="fixed bottom-22 left-0 right-0 m-auto w-80 rounded-lg text-2xl justify-center"
      icon="i-lucide-plus"
    />
  </div>
</template>
