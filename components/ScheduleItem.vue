<script setup lang="ts">
const props = defineProps<{
  hour: number
  minute: number
  weekday: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
}>();

const open = ref(false);
const enabled = ref(true);

const weekdayText = computed(() => {
  const weekdays = [...'日月火水木金土'].filter((_, i) => props.weekday[i]);
  if (weekdays.length == 1) {
    return `${weekdays[0]}曜日`;
  } else {
    return weekdays.join('、');
  }
});
</script>

<template>
  <UCard class="w-full">
    <div class="flex">
      <div class="text-4xl grow">{{ hour }}:{{ minute }}</div>
      <div>
        <UButton
          class="rounded-full"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-chevron-down"
          :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          @click="open = !open"
        />
      </div>
    </div>
    <div class="mt-4 flex">
      <div class="grow">{{ weekdayText }}</div>
      <div class="flex items-center">
        <USwitch v-model="enabled" />
      </div>
    </div>
    <UCollapsible v-model:open="open">
      <template #content>
        <USkeleton class="mt-4 w-full h-20" />
      </template>
    </UCollapsible>
  </UCard>
</template>
