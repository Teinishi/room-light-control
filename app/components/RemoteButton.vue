<script setup lang="ts">
import type {FetchError} from 'ofetch';

const props = defineProps<{
  color?: uButtonColor,
  variant?: uButtonVariant
  commandType: string
}>();

const toast = useToast();

async function send() {
  await $fetch(`/api/remote`, {
    method: 'POST',
    body: { type: props.commandType }
  }).catch((error: FetchError) => {
    const message = error.data.errorMessage || 'サーバーに接続できませんでした';
    toast.add({
      title: message,
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    });
  });
}
</script>

<template>
  <UButton
    class="justify-center px-4 py-2 rounded-lg text-2xl font-normal"
    :color="color"
    :variant="variant"
    @click="send"
  >
    <slot />
  </UButton>
</template>
