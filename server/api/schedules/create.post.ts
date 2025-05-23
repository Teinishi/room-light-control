import { addSchedule, scheduleItemSchemaCheck } from "~/server/scheduleStore";

export default defineEventHandler(async (event) => {
  const {schedule} = await readBody(event);
  if (!scheduleItemSchemaCheck(schedule)) {
    setResponseStatus(event, 400);
    return;
  }

  await addSchedule(schedule);
  return { schedule: schedule };
});
