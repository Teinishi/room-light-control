<script setup lang="ts">
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import ButtonSelect from '~/components/ButtonSelect.vue';
import { round } from '~/utils';
import { type Interval, ceilDate } from '~~/shared/utils/date';

type RangeOption = '24h' | '7d' | '31d' | 'custom';

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

const ONE_HOUR = 60*60*1000;
const ONE_DAY = 24*ONE_HOUR;

const now = new Date();

const rangeOption: Ref<RangeOption> = ref('24h');
const calendarRange = shallowRef({
  start: new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
  end: new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
});
const dateRange = ref({
  start: new Date(now),
  end: new Date(now)
});

function updateDateRange(value?: { start?: CalendarDate, end?: CalendarDate }) {
  if (value !== undefined && value.start !== undefined && value.end !== undefined && rangeOption.value === 'custom') {
    dateRange.value = {
      start: value.start.toDate('Asia/Tokyo'),
      end: value.end.add({ days: 1 }).toDate('Asia/Tokyo')
    };
  }
}

function updateRangeOption(value: RangeOption) {
  if (value === 'custom') {
    updateDateRange(calendarRange.value);
  } else {
    const now = new Date();
    let d;
    switch (value) {
      case '24h':
        d = ONE_DAY;
        break;
      case '7d':
        d = 7*ONE_DAY;
        break;
      case '31d':
        d = 31*ONE_DAY;
        break;
    }
    dateRange.value = {
      start: new Date(now.getTime() - d),
      end: new Date(now)
    }
  }
}
updateRangeOption(rangeOption.value);

const interval = computed(() => {
  const d = dateRange.value.end.getTime() - dateRange.value.start.getTime();
  if (d <= ONE_DAY) {
    return '5m';
  } else {
    return '1h';
  }
});

const queryFrom = computed(() => toISO(new Date(ceilDate(dateRange.value.start, interval.value))));
const queryTo = computed(() => toISO(new Date(ceilDate(dateRange.value.end, interval.value) + parseInterval(interval.value).millisecs)));

const { data: res, pending, refresh } = await useFetch<APISensor>('/api/sensor', {
  query: {
    from: queryFrom,
    to: queryTo,
    interval: interval
  }
});

const sensorData: ComputedRef<SensorDataItem[] | undefined> = computed(() =>
  res.value?.data.map(({t, temperature, humidity}) => ({
    t: Date.parse(t),
    temperature: round(temperature, 1),
    humidity: round(humidity, 1)
  }))
);

const categoriesTemperature = {
  temperature: {
    name: '室内気温',
    color: 'var(--color-primary)'
  }
};
const categoriesHumidity = {
  humidity: {
    name: '室内湿度',
    color: 'var(--color-primary)'
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
  const t = sensorData.value && sensorData.value[tick]?.t;
  if (t === undefined) {
    return '';
  }
  if (interval.value === '5m') {
    return timeFormat.format(new Date(t));
  } else {
    return dateFormat.format(new Date(t));
  }
};
const tooltipTitleFormatter = (data: SensorDataItem) => dateTimeFormat.format(new Date(data.t));

const xExplicitTicks = computed(() => {
  if (res.value === undefined) {
    return [];
  }
  const duration = new Date(res.value.to).getTime() - new Date(res.value.from).getTime();

  return sensorData.value?.flatMap((v, i)=> {
    const d = new Date(v.t);
    let f = d.getMinutes() === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0;
    if (duration > 14*ONE_DAY) {
      f &&= d.getDay() === 0 && d.getHours() === 0;
    } else if (duration > 2*ONE_DAY) {
      f &&= d.getHours() === 0;
    } else if (duration > 12*ONE_HOUR) {
      f &&= d.getHours() % 3 === 0;
    }
    return f ? [i] : [];
  });
});
</script>

<template>
  <div class="w-full max-w-xl px-4 flex flex-col gap-4 items-center">
    <ButtonSelect
      v-model="rangeOption"
      @update:modelValue="updateRangeOption"
      :options="[
        { value: '24h', label: '日' },
        { value: '7d', label: '週' },
        { value: '31d', label: '月' },
        { value: 'custom', label: 'カスタム' }
      ]"
    />
    <InputDateRange
      v-model="calendarRange"
      @update:modelValue="updateDateRange"
      :disabled="rangeOption !== 'custom'"
      :style="{ 'visibility': rangeOption === 'custom' ? 'visible' : 'hidden' }"
    />
    <UCard class="w-full">
      <template #header>
        <h5 class="text-xl font-semibold text-heading">気温</h5>
      </template>
      <client-only>
        <LineChart
          v-if="sensorData !== undefined"
          :data="sensorData"
          :categories="categoriesTemperature"
          :height="200"
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
          hideLegend
          hideTooltip
          :tooltipTitleFormatter="tooltipTitleFormatter"
          :duration="0"
          class="w-full text-neutral-950"
        />
      </client-only>
    </UCard>
    <UCard class="w-full">
      <template #header>
        <h5 class="text-xl font-semibold text-heading">湿度</h5>
      </template>
      <client-only>
        <LineChart
          v-if="sensorData !== undefined"
          :data="sensorData"
          :categories="categoriesHumidity"
          :height="200"
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
          hideLegend
          hideTooltip
          :tooltipTitleFormatter="tooltipTitleFormatter"
          :duration="0"
          class="w-full"
        />
      </client-only>
    </Ucard>
  </div>
</template>
