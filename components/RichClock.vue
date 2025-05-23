<script setup lang="ts">
const props = defineProps<{
  timezone?: string,
  nextScheduleInfo?: {
    commandType: string,
    unixtime: number
  }
}>();

const dateString = ref('');
const time = ref('');
const nextScheduleCountdown = ref('');
const showNextSchedule = ref(false);

const timezone = props.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

const nextCommand = computed(() => COMMAND_TYPES.find(c => c.type === props.nextScheduleInfo?.commandType));

const nextScheduleText = computed(() => {
  if (props.nextScheduleInfo) {
    const d = new Date(props.nextScheduleInfo.unixtime * 1000);
    const timestr = d.toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${WEEKDAYS[d.getDay()]}曜日 ${timestr}`
  } else {
    return ''
  }
});

let animationId: ReturnType<typeof requestAnimationFrame>;

function animationFrame() {
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

  if (props.nextScheduleInfo) {
    const now = new Date();
    const sec = props.nextScheduleInfo.unixtime - Math.floor(now.getTime() / 1000);
    showNextSchedule.value = sec >= 0;

    const minutes = Math.round(sec / 60);
    const hours = Math.round(sec / (60 * 60));
    const days = Math.round(sec / (60 * 60 * 24));

    if (sec < 0) {
      nextScheduleCountdown.value = '';
    } else if (sec < 60) {
      nextScheduleCountdown.value = `${sec}秒後`;
    } else if (minutes < 60) {
      nextScheduleCountdown.value = `${minutes}分後`;
    } else if (hours < 24) {
      nextScheduleCountdown.value = `${hours}時間後`;
    } else {
      nextScheduleCountdown.value = `${days}日後`;
    }
  } else {
    showNextSchedule.value = false;
  }

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
  <div>
    <div class="text-gray-500 text-center">{{ dateString }}</div>
    <div class="text-6xl font-mono">{{ time }}</div>
    <div v-if="nextScheduleInfo && showNextSchedule" class="text-gray-500 flex justify-center gap-4">
      <UBadge :label="nextCommand?.label" :color="nextCommand?.buttonColor" />
      <div>{{ nextScheduleCountdown }}</div>
      <div>{{ nextScheduleText }}</div>
    </div>
  </div>
</template>
