<template>
  <div class="min-w-80 flex flex-col gap-4">
    <ScheduleItem :hour="6" :minute="40" :weekday="[false, false, true, false, false, false, false]" />
    <ScheduleItem :hour="7" :minute="50" :weekday="[false, true, false, false, false, false, false]" />
    <ScheduleItem :hour="8" :minute="20" :weekday="[false, false, false, true, false, false, false]" />
    <ScheduleItem :hour="10" :minute="20" :weekday="[true, false, false, false, true, true, true]" />
  </div>
</template>
