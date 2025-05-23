import type { ScheduleItemSchema } from "~/server/scheduleStore";
import { getSchedules } from "~/server/scheduleStore";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const from = typeof query.from === 'string' ? new Date(parseInt(query.from, 10) * 1000) : new Date();
  const fromTime = from.getTime();

  const {schedules} = await getSchedules();

  let nextScheduleTime: number | undefined;
  let nextSchedule: ScheduleItemSchema | undefined;
  for (let i = 0; i <= 7; i++) {
    const checkDate = new Date(from);
    checkDate.setDate(checkDate.getDate() + i);

    //const yyyyMMdd = checkDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
    //const actualDay = overrides[yyyyMMdd] ?? checkDate.getDay();
    const day = checkDate.getDay();

    schedules.forEach(schedule => {
        if (schedule.weekdays.length !== 0 && !schedule.weekdays.includes(day)) {
          return;
        }
        checkDate.setHours(schedule.hour, schedule.minute, 0, 0);
        const scheduleTime = checkDate.getTime();
        if (scheduleTime < fromTime || (nextScheduleTime !== undefined && nextScheduleTime < scheduleTime)) {
          return;
        }
        nextScheduleTime = scheduleTime;
        nextSchedule = schedule;
    });

    if (nextSchedule) {
      break;
    }
  }

  return {
    schedule: nextSchedule,
    unixtime: nextScheduleTime && Math.floor(nextScheduleTime / 1000)
  }
});
