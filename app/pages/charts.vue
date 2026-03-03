<script setup lang="ts">
import { round } from '~/utils';

interface APISensor {
  from: string,
  to: string,
  interval: '5m' | '1h' | '1d',
  data: {
    t: string,
    temperature: number,
    humidity: number
  }[]
}

const range: Ref<'24h' | '7d' | '31d'> = ref('24h');
const now = ref(new Date());

const from = computed(() => {
  const d = new Date(now.value);
  switch (range.value) {
    case '24h':
      d.setHours(d.getHours() - 24);
      break;
    case '7d':
      d.setDate(d.getDate() - 7);
      break;
    case '31d':
      d.setDate(d.getDate() - 31);
      break;
  }
  return toISO(d);
});
const to = computed(() => toISO(now.value));
const interval = computed(() => range.value === '24h' ? '5m' : '1h');

const { data: res, pending, refresh } = await useFetch<APISensor>('/api/sensor', {
  query: {
    from,
    to,
    interval
  }
});

const categories = {
  temperature: {
    name: 'Temperature',
    color: '#3b82f6',
  },
  humidity: {
    name: 'Humidity',
    color: '#10b981',
  },
};

const sensor_data = computed(() =>
  res.value?.data.map(({t, temperature, humidity}) => ({
    t,
    temperature: round(temperature, 1),
    humidity: round(humidity, 1)
  }))
);
</script>

<template>
  <div class="h-full">
    <LineChart
      v-if="sensor_data !== undefined"
      :data="sensor_data"
      :categories="categories"
      :height="300"
      class="h-full"
      xDomainLine
      yDomainLine
      xTickLine
      yTickLine
      xGridLine
      yGridLine
    />
  </div>
</template>
