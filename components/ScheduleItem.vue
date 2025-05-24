<script setup lang="ts">
import TimePickerModal from './TimePickerModal.vue';

const props = defineProps<{
  enabled: boolean,
  hour: number
  minute: number
  weekdays: number[],
  commandType: string
}>();

const emit = defineEmits(['update:enabled', 'update:hour', 'update:minute', 'update:weekdays', 'update:commandType', 'delete']);


const commandOptions = ref(COMMAND_TYPES.map(c => ({label: c.label, value: c.type})));
const collapsibleOpen = ref(false);

const weekdayText = computed(() => {
  const weekdays = WEEKDAYS.filter((_, i) => props.weekdays.includes(i));
  const len = weekdays.length;
  if (len == 0 || len == 7) {
    return '毎日';
  } if (weekdays.length == 1) {
    return `${weekdays[0]}曜日`;
  } else {
    return weekdays.join('、');
  }
});

function changeTime({hour, minute}: {hour: number, minute: number}) {
  emit('update:hour', hour);
  emit('update:minute', minute);
}

function updateWeekday(i: number, selected: boolean) {
  const s = new Set(props.weekdays);
  if (selected) {
    s.add(i);
  } else {
    s.delete(i);
  }
  emit('update:weekdays', [...s]);
}
</script>

<template>
  <UCard class="w-full" @click="collapsibleOpen = !collapsibleOpen">
    <div class="flex">
      <div class="grow flex items-end">
        <TimePickerModal
          :default-hour="hour"
          :default-minute="minute"
          @change="changeTime"
        >
          <span class="text-4xl" @click.stop>{{ hour }}:{{ minute.toString().padStart(2, '0') }}</span>
        </TimePickerModal>
        <div class="ml-4">{{ weekdayText }}</div>
      </div>
      <div>
        <UButton
          class="rounded-full"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-chevron-down"
          :ui="{ trailingIcon: `${collapsibleOpen ? 'rotate-180 ' : '' }transition-transform duration-200` }"
        />
      </div>
    </div>
    <div class="mt-4 h-6 flex items-center gap-4">
      <USelect
        :items="commandOptions"
        :model-value="commandType"
        class="grow"
        @update:model-value="v => emit('update:commandType', v)"
      />
      <USwitch :model-value="enabled" @update:model-value="v => emit('update:enabled', v)" @click.stop />
    </div>

    <UCollapsible v-model:open="collapsibleOpen">
      <template #content>
        <div class="mt-4 w-full flex flex-col gap-4" @click.stop>
          <div class="grid grid-cols-7 gap-1">
            <UCheckbox
              v-for="(name, index) in WEEKDAYS"
              :key="index"
              :label="name"
              :model-value="weekdays.includes(index)"
              indicator="hidden"
              variant="card"
              class="p-1 aspect-square flex items-center"
              @update:model-value="v => updateWeekday(index, Boolean(v))"
            />
          </div>
          <div class="flex gap-4 justify-end">
            <UButton
              icon="i-lucide-trash-2"
              label="削除"
              color="error"
              variant="outline"
              @click="emit('delete')"
            />
          </div>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>
