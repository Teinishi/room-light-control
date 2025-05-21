<script setup lang="ts">
const { data: timezone } = await useFetch('/api/timezone');
</script>

<template>
  <div class="w-full min-h-dvh pt-42 pb-22 flex flex-col items-center">
    <div class="fixed z-9999 top-0 p-4 w-full h-40 bg-(--ui-bg) flex justify-center items-center">
      <RichClock :timezone="timezone ?? undefined" />
    </div>
    <NuxtPage />
    <div class="fixed z-9999 bottom-0 p-4 w-full h-20 bg-(--ui-bg) flex justify-center items-center">
      <NavigationBar />
    </div>
  </div>
</template>
