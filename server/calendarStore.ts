import path from 'path';
import { JSONFilePreset } from 'lowdb/node';
import { dateString } from '~/utils';
import holiday_jp from "@holiday-jp/holiday_jp";

export interface CalendarStoreSchema {
  overrideDays: Record<string, number>
}

async function init() {
  const db = await JSONFilePreset<CalendarStoreSchema>(
    path.join(process.env.STORE_DIRECTORY as string, 'calender.json'),
    { overrideDays: {} }
  );

  let timeoutId: ReturnType<typeof setTimeout>;
  const write = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => await db.write(), 1000);
  };

  return {db, write};
}

const dbContainer = init();

export const getOverrideDays = async () => (await dbContainer).db.data;

export const updateOverrideDay = async (targetDate: Date, overrideDay: number) => {
  const {db, write} = await dbContainer;

  const key = dateString(targetDate);

  if (targetDate.getDay() === overrideDay) {
    const {[key]: _, ...rest} = db.data.overrideDays;
    db.data.overrideDays = rest;
  } else {
    db.data.overrideDays[key] = overrideDay;
  }

  write();
};

export const getDay = async (date: Date) =>
  (await getOverrideDays()).overrideDays[dateString(date)] ??
  (holiday_jp.isHoliday(date) ? 0 : date.getDay());
