<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number,
  range: [number, number],
  padding?: number,
  ui?: {
    item?: string
  }
}>(), {
  padding: undefined,
  ui: () => ({
    item: 'font-mono text-5xl flex justify-center items-center'
  })
});

const emit = defineEmits(['update:modelValue']);

const carousel = useTemplateRef('carousel');

const modLen = (x: number) => x % (props.range[1] + 1 - props.range[0]);

const items = [...range(props.range[0], props.range[1] + 1, 1)];

let before_init = true;

onMounted(() => {
  setTimeout(() => {
    before_init = false;
  }, 10);
});

function onSelect(index: number) {
  if (!before_init) {
    emit('update:modelValue', modLen(props.range[0] + index));
  }
}

watchEffect(() => {
  carousel.value?.emblaApi?.scrollTo(props.modelValue, before_init);
});

function changeIndexBy(delta: number) {
  emit('update:modelValue', modLen(props.modelValue + delta));
}
</script>

<template>
  <div class="flex flex-col">
    <UButton
      icon="i-lucide-chevron-up"
      variant="subtle"
      color="neutral"
      class="justify-center"
      @click="changeIndexBy(-1)"
    />
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="items"
      orientation="vertical"
      loop
      :skip-snaps="true"
      :ui="{ container: 'h-16 mt-0', item: 'pt-0' }"
      :class="`w-16 h-16`"
      @select="onSelect"
    >
      <div :class="`w-16 h-16 ${ui.item}`">{{ padding ? item.toString().padStart(padding, '0') : item }}</div>
    </UCarousel>
    <UButton
      icon="i-lucide-chevron-down"
      variant="subtle"
      color="neutral"
      class="justify-center"
      @click="changeIndexBy(1)"
    />
  </div>
</template>
