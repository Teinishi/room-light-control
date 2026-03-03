export const useServerStore = defineStore('serverStore', {
  state: () => ({
    timezone: undefined as string | undefined,
    nextScheduleCommandType: undefined as string | undefined,
    nextScheduleTime: undefined as number | undefined
  }),
  actions: {
    async fetch() {
      const timezone = await $fetch('/api/timezone');
      const nextScheduleInfo = await $fetch('/api/schedules/next');
      this.timezone = timezone;
      this.nextScheduleCommandType = nextScheduleInfo.schedule?.commandType;
      this.nextScheduleTime = nextScheduleInfo.unixtime;
    }
  }
});
