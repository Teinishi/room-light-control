<script setup lang="ts">
import { today, type DateValue } from '@internationalized/date';

const { data: calendar, refresh: refreshCalenders } = await useFetch('/api/calendar/list');

const serverStore = useServerStore();

function refresh() {
  refreshCalenders();
  serverStore.fetch();
}

const timezone = computed(() => serverStore.timezone ?? '');

const selectedDate = ref<DateValue | null>(null);

const selectedDay = ref(0);

const getOverrideDay = (date: DateValue) => calendar.value?.overrideDays.find(o => o.year === date.year && o.month === date.month && o.date === date.day);

function selectChanged(date: DateValue) {
  if (selectedDate.value !== null
    && selectedDate.value.year === date.year
    && selectedDate.value.month === date.month
    && selectedDate.value.day === date.day
  ) {
    return;
  }
  selectedDate.value = date;
  selectedDay.value = getOverrideDay(date)?.overrideDay ?? date.toDate(timezone.value).getDay();
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

const hasDateChip = (date: DateValue) => getOverrideDay(date) !== undefined;

async function updateOverrideDay(value: number) {
  if (selectedDate.value !== null) {
    await $fetch('/api/calendar/update', {
      method: 'POST',
      body: {
        overrideDay: {
          year: selectedDate.value.year,
          month: selectedDate.value.month,
          date: selectedDate.value.day,
          overrideDay: value
        }
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
        <UChip :show="hasDateChip(day)">
          {{ day.day }}
        </UChip>
      </template>
    </UCalendar>
    <div class="w-full space-y-1">
      <div>曜日読み替え</div>
      <WeekSelect v-model="selectedDay" @update:model-value="updateOverrideDay" />
    </div>
  </div>
</template>
