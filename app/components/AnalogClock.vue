<script setup lang="ts">
const ANIMATION_DURATION = 300;

const props = defineProps<{
  hour: number,
  minute: number,
  second: number
}>();

const secondNeedleAngle = ref(0);

let animationId: ReturnType<typeof requestAnimationFrame>;
let prevFrameSecond: number;
let prevFrameX: number;
let animationStartTime: number;
function animationFrame() {
  const now = Date.now();
  if (props.second !== prevFrameSecond) {
    animationStartTime = now;
    prevFrameX = 0;
  }

  const targetAngle = 6 * props.second;
  const t = Math.max((now - animationStartTime) / ANIMATION_DURATION, 0);
  if (t >= 1) {
    secondNeedleAngle.value = targetAngle;
  } else {
    const x = easeOutElastic(t);
    if (1 - prevFrameX !== 0) {
      secondNeedleAngle.value += (x - prevFrameX) / (1 - prevFrameX) * angleDiff(targetAngle, secondNeedleAngle.value);
    }
    prevFrameSecond = props.second;
    prevFrameX = x;
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
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" class="light:fill-gray-100 dark:fill-gray-800" />
    <line
      v-for="i in 12"
      :key="i"
      x1="50"
      y1="3"
      x2="50"
      y2="6"
      class="light:stroke-gray-300 dark:stroke-gray-700"
      stroke-linecap="round"
      :transform="`rotate(${30 * i} 50 50)`"
    />
    <line
      x1="50"
      y1="20"
      x2="50"
      y2="54"
      class="stroke-primary"
      stroke-linecap="round"
      stroke-width="2"
      :transform="`rotate(${30 * (hour + (minute + second / 60) / 60)} 50 50)`"
    />
    <line
      x1="50"
      y1="10"
      x2="50"
      y2="56"
      class="stroke-gray-500"
      stroke-linecap="round"
      stroke-width="2"
      :transform="`rotate(${6 * (minute + second / 60)} 50 50)`"
    />
    <line
      x1="50"
      y1="10"
      x2="50"
      y2="58"
      class="light:stroke-gray-400 dark:stroke-gray-600"
      stroke-linecap="round"
      :transform="`rotate(${secondNeedleAngle % 360} 50 50)`"
    />
  </svg>
</template>
