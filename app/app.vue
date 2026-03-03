<script setup lang="ts">
import { en, ja } from '@nuxt/ui/locale';
import { useServerStore } from '~/stores/server';

useHead({
  htmlAttrs: {
    lang: 'ja'
  }
});

const serverStore = useServerStore();
await callOnce(serverStore.fetch);

const locale = ref(en);
onMounted(() => {
  locale.value = ja;
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaManifest />
  <UApp :locale="locale" :toaster="{position: 'top-right'}">
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
