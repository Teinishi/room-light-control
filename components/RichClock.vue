<script setup lang="ts">
const props = defineProps<{
  timezone?: string
}>();

const dateString = ref('');
const time = ref('');

function updateTime(timezone: string) {
  const now = new Date();
  dateString.value = now.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    timeZone: props.timezone,
    weekday: 'short'
  });
  time.value = now.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const timezone = props.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

let animationId: ReturnType<typeof requestAnimationFrame>;

function animationFrame() {
  updateTime(timezone);
  animationId = requestAnimationFrame(animationFrame);
}

onMounted(() => {
  animationFrame();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="text-grey-500">{{ dateString }}</div>
    <div class="text-6xl font-mono">{{ time }}</div>
  </div>
</template>
