<script setup lang="ts">
const props = defineProps<{
  hour: number
  minute: number
  weekday: boolean[]
}>();

const emit = defineEmits(['update:hour', 'update:minute']);

const uiStore = useUiStore();

const modalOpen = ref(false);
const collapsibleOpen = ref(false);
const enabled = ref(true);

const hourEdit = ref(0);
const minuteEdit = ref(0);

const weekdayText = computed(() => {
  const weekdays = [...'日月火水木金土'].filter((_, i) => props.weekday[i]);
  if (weekdays.length == 1) {
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
</script>

<template>
  <UCard class="w-full">
    <div class="flex">
      <div class="grow">
        <UModal v-model:open="modalOpen">
          <span class="text-4xl">{{ hour }}:{{ minute.toString().padStart(2, '0') }}</span>
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
          :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          @click="collapsibleOpen = !collapsibleOpen"
        />
      </div>
    </div>
    <div class="mt-4 flex">
      <div class="grow">{{ weekdayText }}</div>
      <div class="flex items-center">
        <USwitch v-model="enabled" />
      </div>
    </div>

    <UCollapsible v-model:open="collapsibleOpen">
      <template #content>
        <USkeleton class="mt-4 w-full h-20" />
      </template>
    </UCollapsible>
  </UCard>
</template>
