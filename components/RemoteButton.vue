<script setup lang="ts">
const props = defineProps<{
  color?: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral",
  variant?: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost"
  commandType: string
}>();

const toast = useToast();

async function send() {
  const result = await $fetch(`/api/remote?type=${props.commandType}`);
  if (result.errorType) {
    toast.add({
      title: result.errorMessage,
      color: 'error'
    })
  }
}
</script>

<template>
  <UButton class="justify-center" size="xl" :color="color" :variant="variant" @click="send"><slot/></UButton>
</template>
