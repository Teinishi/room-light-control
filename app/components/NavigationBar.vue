<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[]>([
  {
    label: '照明',
    icon: 'i-lucide-lightbulb',
    to: '/'
  },
  {
    label: 'センサー',
    icon: 'i-lucide-chart-line',
    to: '/charts'
  },
  {
    label: '自動点灯',
    icon: 'i-lucide-alarm-clock',
    to: '/schedules'
  },
  {
    label: 'カレンダー',
    icon: 'i-lucide-calendar',
    to: '/calendar'
  }
]);
</script>

<template>
  <div class="py-6">
    <UNavigationMenu :items="items" collapsed />
  </div>
</template>
