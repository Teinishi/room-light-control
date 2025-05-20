<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'ja'
  }
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaManifest />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
      <NavigationBar />
    </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
