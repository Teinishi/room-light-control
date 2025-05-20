<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[]>([
  {
    label: '照明',
    icon: 'i-lucide-lightbulb',
    to: '/'
  },
  {
    label: '自動点灯',
    icon: 'i-lucide-alarm-clock',
    to: '/schedule'
  },
  {
    label: '設定',
    icon: 'i-lucide-settings',
    to: '/settings'
  }
]);
</script>

<template>
  <div class="py-6">
    <UNavigationMenu :items="items" collapsed />
  </div>
</template>
