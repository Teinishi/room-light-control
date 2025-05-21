<script setup lang="ts">
const props = withDefaults(defineProps<{
  items: number[],
  padding: number | undefined,
  ui?: {
    item?: string
  }
}>(), {
  ui: () => ({
    item: 'font-mono text-5xl flex justify-center items-center'
  })
});

const carousel = useTemplateRef('carousel');
const activeValue = defineModel<number>();

let before_init = true;

onMounted(() => {
  setTimeout(() => {
    before_init = false;
  }, 10);
});

function onSelect(index: number) {
  if (!before_init) {
    activeValue.value = props.items[index];
  }
}

watchEffect(() => {
  if (activeValue.value) {
    carousel.value?.emblaApi?.scrollTo(props.items.indexOf(activeValue.value), before_init);
  }
});
</script>

<template>
  <UCarousel
    ref="carousel"
    v-slot="{ item }"
    :items="items"
    orientation="vertical"
    loop
    :skip-snaps="true"
    :ui="{ container: 'h-16 mt-0', item: 'pt-0' }"
    :class="`w-16 h-16 *:w-full *:h-full`"
    @select="onSelect"
  >
    <div :class="`w-16 h-16 ${ui.item}`">{{ padding ? item.toString().padStart(padding, '0') : item }}</div>
  </UCarousel>
</template>
