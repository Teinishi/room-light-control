export const useSensorStore = defineStore('sensorStore', {
  state: () => ({
  }),
  actions: {
    async fetch() {
      await $fetch('/api/sensor');
    }
  }
});
