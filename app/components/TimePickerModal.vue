<script setup lang="ts">
const props = defineProps<{
  defaultHour?: number,
  defaultMinute?: number,
}>();

const emit = defineEmits(['change']);

const uiStore = useUiStore();

const open = ref(false);

const hourEdit = ref(0);
const minuteEdit = ref(0);

watchEffect(() => {
  const now = new Date();
  const hour = props.defaultHour ?? now.getHours();
  const minute = props.defaultMinute ?? now.getMinutes();
  if (open.value) {
    hourEdit.value = hour;
    minuteEdit.value = minute;
  }
});

function updateTime() {
  open.value = false;
  emit('change', { hour: hourEdit.value, minute: minuteEdit.value });
}
</script>

<template>
  <UModal v-model:open="open">
    <slot />
    <template #content>
      <div class="w-full py-4 flex flex-col justify-center items-center">
        <TimePicker
          v-model:hour="hourEdit"
          v-model:minute="minuteEdit"
          :number-input="uiStore.timePickerNumberInput"
        />
        <div class="w-full mt-4 px-4 flex justify-end gap-4">
          <UButton
            icon="i-lucide-keyboard"
            color="neutral"
            variant="ghost"
            size="xl"
            class="rounded-full"
            @click="uiStore.timePickerNumberInput = !uiStore.timePickerNumberInput"
          />
          <div class="grow" />
          <UButton color="neutral" variant="ghost" @click="open = false">キャンセル</UButton>
          <UButton @click="updateTime">OK</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
