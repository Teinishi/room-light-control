<script setup lang="ts">
const { data: schedules, refresh: refreshSchedules } = await useFetch('/api/schedules/list');

const toast = useToast();

const uiStore = useUiStore();

function refresh() {
  refreshSchedules();
  uiStore.fetch();
}

async function addSchedule({hour, minute}: {hour: number, minute: number}) {
  try {
    await $fetch('/api/schedules/create', {
      method: 'POST',
      body: {
        schedule: {
          hour, minute
        }
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(err) {
    toast.add({
      title: 'エラーが発生しました',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    });
  }
  refresh();
}

async function deleteSchedule(id: number) {
  try {
    await $fetch(`/api/schedules/delete/${id}`, { method: 'POST' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(err) {
    toast.add({
      title: 'エラーが発生しました',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    });
  }
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
  try {
    await $fetch(`/api/schedules/update/${id}`, {
      method: 'post',
      body: { schedule: patch }
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(err) {
    toast.add({
      title: 'エラーが発生しました',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    });
  }
  clearTimeout(timeoutId);
  timeoutId = setTimeout(refresh, 1000);
}
</script>

<template>
  <div class="w-80 pb-13 space-y-4 relative">
    <TransitionGroup
      enter-active-class="transition"
      leave-active-class="transition absolute"
      enter-from-class="opacity-0 translate-y-10"
      leave-to-class="opacity-0 -translate-y-10"
      move-class="transition-transform"
    >
      <ScheduleItem
        v-for="schedule in schedules?.schedules"
        :key="schedule.id"
        v-model:enabled="schedule.enabled"
        v-model:hour="schedule.hour"
        v-model:minute="schedule.minute"
        v-model:weekdays="schedule.weekdays"
        v-model:command-type="schedule.commandType"
        class="w-full duration-300"
        @update:enabled="v => updateSchedule(schedule.id, {enabled: v})"
        @update:hour="v => updateSchedule(schedule.id, {hour: v})"
        @update:minute="v => updateSchedule(schedule.id, {minute: v})"
        @update:weekdays="v => updateSchedule(schedule.id, {weekdays: v})"
        @update:command-type="v => updateSchedule(schedule.id, {commandType: v})"
        @delete="deleteSchedule(schedule.id)"
      />
    </TransitionGroup>
    <Transition
      enter-active-class="transition-opacity"
      leave-active-class="transition-opacity absolute"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="schedules?.schedules.length == 0"
        key="no-schedules"
        class="w-full py-16 text-center text-gray-500 absolute top-0 duration-300"
      >
        設定がありません
      </div>
    </Transition>
    <TimePickerModal @change="addSchedule">
      <UButton
        class="fixed bottom-22 left-0 right-0 m-auto w-80 rounded-lg text-2xl justify-center"
        icon="i-lucide-plus"
      />
    </TimePickerModal>
  </div>
</template>
