<script setup lang="ts">
import { today } from '@internationalized/date';

const selectedDate = ref(undefined);

const selectedDay = ref(0);
const loading = ref(true);

function selectChanged(date) {
  selectedDate.value = date;
  loading.value = true;
  selectedDay.value = date.toDate().getDay();
}

onMounted(() => selectChanged(today()));
</script>

<template>
  <div class="grow flex flex-col justify-center items-center w-80 space-y-4">
    <UCalendar :model-value="selectedDate" size="xl" class="w-full" @update:model-value="selectChanged" />
    <div class="w-full space-y-1">
      <div>曜日読み替え</div>
      <WeekSelect v-model="selectedDay" :disabled="loading" />
    </div>
  </div>
</template>
