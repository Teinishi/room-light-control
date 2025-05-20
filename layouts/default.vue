<script setup lang="ts">
const { data: timezone } = await useFetch('/api/timezone');
</script>

<template>
  <div class="h-dvh p-8 flex flex-col justify-between items-center">
    <RichClock class="h-40 justify-center" :timezone="timezone ?? undefined" />
    <NuxtPage />
    <NavigationBar />
  </div>
</template>
