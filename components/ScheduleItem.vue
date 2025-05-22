<script setup lang="ts">
const props = defineProps<{
  hour: number
  minute: number
  weekdays: number[]
}>();

const emit = defineEmits(['update:hour', 'update:minute', 'update:weekdays']);

const uiStore = useUiStore();

const modalOpen = ref(false);
const collapsibleOpen = ref(false);
const enabled = ref(true);

const hourEdit = ref(0);
const minuteEdit = ref(0);

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

watchEffect(() => {
  if (modalOpen.value) {
    hourEdit.value = props.hour;
    minuteEdit.value = props.minute;
  }
});

function updateTime() {
  modalOpen.value = false;
  emit('update:hour', hourEdit.value);
  emit('update:minute', minuteEdit.value);
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
      <div class="grow">
        <UModal v-model:open="modalOpen">
          <span class="text-4xl" @click.stop>{{ hour }}:{{ minute.toString().padStart(2, '0') }}</span>
          <template #content>
            <div class="w-full py-4 flex flex-col justify-center items-center">
              <TimePicker
                v-model:hour="hourEdit"
                v-model:minute="minuteEdit"
                :number-input="uiStore.timePickerNumberInput"
              />
              <div class="w-full px-4 flex justify-end gap-4">
                <UButton
                  icon="i-lucide-keyboard"
                  color="neutral"
                  variant="ghost"
                  size="xl"
                  class="rounded-full"
                  @click="uiStore.timePickerNumberInput = !uiStore.timePickerNumberInput"
                />
                <div class="grow" />
                <UButton color="neutral" variant="ghost" @click="modalOpen = false">キャンセル</UButton>
                <UButton @click="updateTime">OK</UButton>
              </div>
            </div>
          </template>
        </UModal>
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
    <div class="mt-4 h-6 flex items-center">
      <div class="grow">{{ weekdayText }}</div>
      <USwitch v-model="enabled" @click.stop />
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
          <div class="flex justify-end">
            <UButton
              icon="i-lucide-trash-2"
              label="削除"
              color="error"
              variant="outline"
            />
          </div>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>
