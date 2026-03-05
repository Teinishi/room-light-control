<script setup lang="ts">
import ButtonSelect from '~/components/ButtonSelect.vue';
import { round } from '~/utils';
import { type Interval, ceilDate } from '~~/shared/utils/date';

interface APISensor {
  from: string,
  to: string,
  interval: Interval,
  data: {
    t: string,
    temperature: number,
    humidity: number
  }[]
}

interface SensorDataItem {
  t: number;
  temperature: number;
  humidity: number;
}

const range: Ref<'24h' | '7d' | '31d'> = ref('24h');
const query_interval = computed(() => range.value === '24h' ? '5m' : '1h');
const to_t = ref(ceilDate(new Date(), query_interval.value));
const from_t = computed(() => {
  const d = new Date(to_t.value);
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
  return ceilDate(d, query_interval.value);
});

const query_from = computed(() => toISO(new Date(from_t.value)));
const query_to = computed(() => toISO(new Date(to_t.value)));

const { data: res, pending, refresh } = await useFetch<APISensor>('/api/sensor', {
  query: {
    from: query_from,
    to: query_to,
    interval: query_interval
  }
});

const sensor_data: ComputedRef<SensorDataItem[] | undefined> = computed(() =>
  res.value?.data.map(({t, temperature, humidity}) => ({
    t: Date.parse(t),
    temperature: round(temperature, 1),
    humidity: round(humidity, 1)
  }))
);

const categoriesTemperature = {
  temperature: {
    name: '室内気温'
  }
};
const categoriesHumidity = {
  humidity: {
    name: '室内湿度'
  }
};

const dateFormat = new Intl.DateTimeFormat('ja-JP', {
  month: '2-digit',
  day: '2-digit',
});
const timeFormat = new Intl.DateTimeFormat('ja-JP', {
  timeStyle: 'short',
  timeZone: 'Asia/Tokyo',
});
const dateTimeFormat = new Intl.DateTimeFormat('ja-JP', {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tokyo',
});

const xFormatter = (tick: number, i?: number | undefined, ticks?: number[] | undefined) => {
  const t = sensor_data.value && sensor_data.value[tick]?.t;
  if (t === undefined) {
    return '';
  }
  if (query_interval.value === '5m') {
    return timeFormat.format(new Date(t));
  } else {
    return dateFormat.format(new Date(t));
  }
};
const tooltipTitleFormatter = (data: SensorDataItem) => dateTimeFormat.format(new Date(data.t));

const xExplicitTicks = computed(() => sensor_data.value?.flatMap((v, i)=> {
  const d = new Date(v.t + 9*60*60*1000);
  let f = d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0 && d.getUTCMilliseconds() === 0;
  switch (res.value?.interval) {
    case '5m':
      f &&= d.getHours() % 3 === 0;
      break;
    case '1h':
      f &&= d.getUTCHours() === 0;
      break;
    case '1d':
      f &&= d.getDay() === 0 && d.getUTCHours() === 0;
      break;
  }
  return f ? [i] : [];
}));
</script>

<template>
  <div class="w-full max-w-xl flex flex-col gap-4 items-center">
    <ButtonSelect
      v-model="range"
      :options="[
        { value: '24h', label: '日' },
        { value: '7d', label: '週' },
        { value: '31d', label: '月' }
      ]"
    />
    <client-only>
      <LineChart
        v-if="sensor_data !== undefined"
        :data="sensor_data"
        :categories="categoriesTemperature"
        :height="240"
        yLabel="気温"
        :padding="{ top: 16, right: 0, bottom: 16, left: 0 }"
        :yDomain="[10, 40]"
        :xFormatter="xFormatter"
        :yFormatter="(y: number) => `${y}℃`"
        :xExplicitTicks="xExplicitTicks"
        :yExplicitTicks="[10, 20, 30, 40]"
        :curveType="CurveType.Linear"
        xDomainLine
        yDomainLine
        xTickLine
        yTickLine
        xGridLine
        yGridLine
        :legendPosition="LegendPosition.TopRight"
        :tooltipTitleFormatter="tooltipTitleFormatter"
        :duration="0"
        class="w-full"
      />
      <LineChart
        v-if="sensor_data !== undefined"
        :data="sensor_data"
        :categories="categoriesHumidity"
        :height="240"
        yLabel="湿度"
        :padding="{ top: 0, right: 0, bottom: 0, left: 0 }"
        :yDomain="[0, 100]"
        :xFormatter="xFormatter"
        :yFormatter="(y: number) => `${y}%`"
        :xExplicitTicks="xExplicitTicks"
        :yExplicitTicks="[0, 20, 40, 60, 80, 100]"
        :curveType="CurveType.Linear"
        xDomainLine
        yDomainLine
        xTickLine
        yTickLine
        xGridLine
        yGridLine
        :legendPosition="LegendPosition.TopRight"
        :tooltipTitleFormatter="tooltipTitleFormatter"
        :duration="0"
        class="w-full"
      />
    </client-only>
  </div>
</template>
