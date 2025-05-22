import { addSchedule } from "~/server/scheduleStore";

export default defineEventHandler(async (event) => {
  const {schedule} = await readBody(event);
  addSchedule(schedule);
  return { schedule: schedule };
});
