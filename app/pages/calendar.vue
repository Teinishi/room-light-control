<script setup lang="ts">
import { today, type DateValue } from '@internationalized/date';
import { useServerStore } from '~/stores/server';

const { data: calendar, refresh: refreshCalenders } = await useFetch('/api/calendar/list');

const serverStore = useServerStore();

function refresh() {
  refreshCalenders();
  serverStore.fetch();
}

const selectedDate = ref<DateValue | null>(null);
const selectedDay = ref(-1);

const timezone = computed(() => serverStore.timezone ?? '');
const holidayName = computed(() => {
  const holidays = calendar.value?.holidays;
  if (!selectedDate.value || !holidays) return '';
  const name = holidays[getKey({
      year: selectedDate.value.year,
      month: selectedDate.value.month,
      day: selectedDate.value.day
    })];
  return name ? `(${name})` : '';
});

const getKey = (date: {year: number, month: number, day: number}) =>
  [date.year, date.month, date.day].map((v, i) => v.toString().padStart(i === 0 ? 4 : 2, '0')).join('-');

function selectChanged(date: DateValue) {
  if (!date || selectedDate.value !== null
    && selectedDate.value.year === date.year
    && selectedDate.value.month === date.month
    && selectedDate.value.day === date.day
  ) {
    return;
  }
  selectedDate.value = date;
  selectedDay.value = calendar.value?.overrideDays[getKey(date)] ?? date.toDate(timezone.value).getDay();
}

onMounted(() => selectChanged(today(timezone.value)));

function isDateDisabled(date: DateValue) {
  const year = date.year;
  const month = date.month;
  const day = date.day;
  const t = today(timezone.value);
  const tYear = t.year;
  const tMonth = t.month;
  const tDay = t.day;

  return year < tYear || year === tYear && (month < tMonth || month === tMonth && day < tDay);
}

const chipColor = (date: DateValue) => {
  if (isDateDisabled(date)) return undefined;
  const key = getKey(date);
  if (key in (calendar.value?.overrideDays ?? {})) return 'primary'
  else if (key in (calendar.value?.holidays ?? {})) return 'error'
  else return undefined;
};

async function updateOverrideDay(value: number) {
  if (selectedDate.value !== null) {
    await $fetch('/api/calendar/update', {
      method: 'POST',
      body: {
        year: selectedDate.value.year,
        month: selectedDate.value.month,
        date: selectedDate.value.day,
        overrideDay: value
      }
    });
  }
  refresh();
}
</script>

<template>
  <div class="grow flex flex-col justify-center items-center w-80 space-y-4">
    <!-- @vue-expect-error -->
    <UCalendar
      size="xl"
      class="w-full"
      :is-date-disabled="isDateDisabled"
      :model-value="selectedDate"
      @update:model-value="selectChanged"
    >
      <template #day="{ day }">
        <UChip :show="!!chipColor(day)" :color="chipColor(day)">
          {{ day.day }}
        </UChip>
      </template>
    </UCalendar>
    <div class="w-full space-y-1">
      <div>曜日読み替え {{ holidayName }}</div>
      <WeekSelect v-model="selectedDay" @update:model-value="updateOverrideDay" />
    </div>
  </div>
</template>
