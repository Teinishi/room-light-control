import { scheduleItemSchemaCheck, updateSchedule } from "~/server/scheduleStore";

export default defineEventHandler(async event => {
  const id_s = getRouterParam(event, 'id');
  if (!id_s) {
    setResponseStatus(event, 400);
    return;
  }
  const id = parseInt(id_s as string, 10);

  const {schedule: newSchedule} = await readBody(event);
  if (!scheduleItemSchemaCheck(newSchedule)) {
    setResponseStatus(event, 400);
    return;
  }
  updateSchedule(id, schedule => {
    newSchedule.id = schedule.id;
    Object.assign(schedule, newSchedule);
    return schedule;
  });
});
