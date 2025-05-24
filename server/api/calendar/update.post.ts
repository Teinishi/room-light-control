import { overrideDayItemSchemaCheck, updateOverrideDay } from "~/server/calendarStore";

export default defineEventHandler(async (event) => {
  const {overrideDay} = await readBody(event);
  if (!overrideDayItemSchemaCheck(overrideDay)) {
    setResponseStatus(event, 400);
    return;
  }

  await updateOverrideDay(overrideDay);
  return;
});
