export const useUiStore = defineStore('uiStore', () => {
  const clockType = ref('digital');
  const timePickerNumberInput = ref(false);
  return { clockType, timePickerNumberInput };
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage()
  }
});
