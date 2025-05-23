<script setup lang="ts">
const uiStore = useUiStore();

const nextScheduleInfo = computed(() => {
  const commandType = uiStore.nextScheduleCommandType;
  const unixtime = uiStore.nextScheduleTime;

  return (commandType !== undefined && unixtime !== undefined) ? {commandType, unixtime} : undefined;
});
</script>

<template>
  <div class="w-full min-h-dvh pt-50 pb-22 flex flex-col items-center">
    <div class="fixed z-9999 top-0 p-4 w-full h-48 bg-(--ui-bg) flex justify-center items-center">
      <RichClock
        :timezone="uiStore.timezone"
        :next-schedule-info="nextScheduleInfo"
        @passed-next="uiStore.fetch"
      />
    </div>
    <NuxtPage />
    <div class="fixed z-9999 bottom-0 p-4 w-full h-20 bg-(--ui-bg) flex justify-center items-center">
      <NavigationBar />
    </div>
  </div>
</template>
