<script setup lang="ts">
const { data: schedules, refresh } = await useFetch('/api/schedules/list');

async function addSchedule({hour, minute}: {hour: number, minute: number}) {
  await $fetch('/api/schedules/create', {
    method: 'POST',
    body: {
      schedule: {
        hour, minute
      }
    }
  });
  refresh();
}

async function deleteSchedule(id: number) {
  await $fetch(`/api/schedules/delete/${id}`, { method: 'POST' });
  refresh();
}

let timeoutId: ReturnType<typeof setTimeout>;

async function updateSchedule(id: number, patch: {
  enabled?: boolean,
  hour?: number,
  minute?: number,
  weekdays?: number[],
  commandType?: string,
}) {
  await $fetch(`/api/schedules/update/${id}`, {
    method: 'post',
    body: { schedule: patch }
  });
  clearTimeout(timeoutId);
  timeoutId = setTimeout(refresh, 1000);
}
</script>

<template>
  <div class="w-80 pb-13 flex flex-col gap-4">
    <ScheduleItem
      v-for="schedule in schedules?.schedules"
      :key="schedule.id"
      v-model:enabled="schedule.enabled"
      v-model:hour="schedule.hour"
      v-model:minute="schedule.minute"
      v-model:weekdays="schedule.weekdays"
      v-model:command-type="schedule.commandType"
      @update:enabled="v => updateSchedule(schedule.id, {enabled: v})"
      @update:hour="v => updateSchedule(schedule.id, {hour: v})"
      @update:minute="v => updateSchedule(schedule.id, {minute: v})"
      @update:weekdays="v => updateSchedule(schedule.id, {weekdays: v})"
      @update:command-type="v => updateSchedule(schedule.id, {commandType: v})"
      @delete="deleteSchedule(schedule.id)"
    />
    <TimePickerModal @change="addSchedule">
      <UButton
        class="fixed bottom-22 left-0 right-0 m-auto w-80 rounded-lg text-2xl justify-center"
        icon="i-lucide-plus"
      />
    </TimePickerModal>
  </div>
</template>
