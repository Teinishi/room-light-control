export const useUiStore = defineStore('uiStore', () => {
  const clockType: Ref<'digital' | 'analog'> = ref('digital');
  const timePickerNumberInput = ref(false);
  return { clockType, timePickerNumberInput };
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage()
  }
});
