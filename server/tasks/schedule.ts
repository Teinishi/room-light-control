import { dateString } from "~/utils";
import { getOverrideDays } from "../calendarStore";
import { executeCommand } from "../command";
import { getSchedules } from "../scheduleStore";

export default defineTask({
  async run() {
    const now = new Date();
    const nowHour = now.getHours();
    const nowMinute = now.getMinutes();
    const dayOfWeek = (await getOverrideDays()).overrideDays[dateString(now)] ?? now.getDay();
    (await getSchedules()).schedules.find(schedule => {
      if (
        !schedule.enabled
          || schedule.hour !== nowHour
          || schedule.minute !== nowMinute
          || !(schedule.weekdays.length === 0 || schedule.weekdays.includes(dayOfWeek))
      ) {
        return false;
      }
      executeCommand(schedule.commandType);
      return true;
    });
    return { result: 'Success' };
  }
});
