import { updateSchedule } from "~/server/scheduleStore";

export default defineEventHandler(async event => {
  const id = parseInt(getRouterParam(event, 'id') as string, 10);
  const {schedule: newSchedule} = await readBody(event);

  updateSchedule(id, schedule => {
    newSchedule.id = schedule.id;
    Object.assign(schedule, newSchedule);
  });
});
