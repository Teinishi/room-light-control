<script setup lang="ts">
const { data: timezone } = await useFetch('/api/timezone');
</script>

<template>
  <div class="w-full min-h-dvh pt-40 pb-24 flex flex-col items-center">
    <div class="fixed z-9999 top-0 p-4 pb-0 w-full h-36 bg-(--ui-bg) flex justify-center items-center">
      <RichClock :timezone="timezone ?? undefined" />
    </div>
    <NuxtPage />
    <div class="fixed z-9999 bottom-0 p-4 pt-0 w-full h-20 bg-(--ui-bg) flex justify-center items-center">
      <NavigationBar />
    </div>
  </div>
</template>
