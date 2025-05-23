<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'ja'
  }
});

const uiStore = useUiStore();

await callOnce(uiStore.fetch);
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaManifest />
  <UApp :toaster="{position: 'top-right'}">
    <NuxtLayout>
      <NuxtPage />
      <NavigationBar />
    </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.15s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
