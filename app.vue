<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'ja'
  }
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
