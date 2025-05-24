import { getOverrideDays } from "~/server/calendarStore";
import holiday_jp from "@holiday-jp/holiday_jp";
import { dateString } from "~/utils";

export default defineEventHandler(async () => {
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  const holidays = Object.fromEntries(
    holiday_jp.between(today, nextYear).map(
      holiday => ([dateString(holiday.date), holiday.name])
    )
  );

  return {
    ...(await getOverrideDays()),
    holidays
  };
});
