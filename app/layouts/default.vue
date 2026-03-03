<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui';
import { useUiStore } from '~/stores/ui';
import { useServerStore } from '~/stores/server';

const uiStore = useUiStore();
const serverStore = useServerStore();

const clockContextMenu = computed<ContextMenuItem[][]>(() => ([
  [
    {
      label: 'デジタル時計',
      type: 'checkbox',
      checked: uiStore.clockType === 'digital',
      onSelect() {
        uiStore.clockType = 'digital';
      }
    },
    {
      label: 'アナログ時計',
      type: 'checkbox',
      checked: uiStore.clockType === 'analog',
      onSelect() {
        uiStore.clockType = 'analog';
      }
    }
  ]
]));

const nextScheduleInfo = computed(() => {
  const commandType = serverStore.nextScheduleCommandType;
  const unixtime = serverStore.nextScheduleTime;

  return (commandType !== undefined && unixtime !== undefined) ? {commandType, unixtime} : undefined;
});
</script>

<template>
  <div class="w-full min-h-dvh pt-50 pb-22 flex flex-col items-center">
    <div class="fixed z-9999 top-0 p-4 w-full h-48 bg-default flex justify-center items-center select-none">
      <UContextMenu :items="clockContextMenu">
        <RichClock
          :type="uiStore.clockType"
          :timezone="serverStore.timezone"
          :next-schedule-info="nextScheduleInfo"
          @passed-next="serverStore.fetch"
        />
      </UContextMenu>
    </div>
    <NuxtPage />
    <div class="fixed z-9999 bottom-0 p-4 w-full h-20 bg-default flex justify-center items-center">
      <NavigationBar />
    </div>
  </div>
</template>
