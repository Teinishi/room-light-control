export default defineEventHandler(async () => {
  const options = Intl.DateTimeFormat().resolvedOptions();
  return options.timeZone;
})
