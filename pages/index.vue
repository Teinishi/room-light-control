<script setup lang="ts">
const { data: timezone } = await useFetch('/api/timezone');
</script>

<template>
  <div class="h-dvh p-8 flex flex-col justify-evenly items-center">
    <RichClock :timezone="timezone ?? undefined" />
    <LightController class="flex flex-col gap-4" />
  </div>
</template>
