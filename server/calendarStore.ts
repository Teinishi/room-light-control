import path from 'path';
import { JSONFilePreset } from 'lowdb/node';

export interface CalendarStoreSchema {
  overrideDays: OverrideDayItemSchema[]
}

export interface OverrideDayItemSchema {
  year: number,
  month: number,
  date: number,
  overrideDay: number
}

export const overrideDayItemSchemaCheck = (value: unknown) => value && typeof value === 'object'
  && 'year' in value && typeof value.year === 'number'
  && 'month' in value && typeof value.month === 'number'
  && 'date' in value && typeof value.date === 'number'
  && 'overrideDay' in value && typeof value.overrideDay === 'number';

async function init() {
  const db = await JSONFilePreset<CalendarStoreSchema>(
    path.join(process.env.STORE_DIRECTORY as string, 'calender.json'),
    { overrideDays: [] }
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

export const updateOverrideDay = async ({year, month, date, overrideDay}: OverrideDayItemSchema) => {
  const {db, write} = await dbContainer;
  const {overrideDays} = db.data;

  const targetIndex = overrideDays.findIndex(o => o.year === year && o.month === month && o.date === date);

  const defaultDate = new Date();
  defaultDate.setFullYear(year, month - 1, date);
  if (defaultDate.getDay() === overrideDay) {
    if (targetIndex !== -1) {
      overrideDays.splice(targetIndex, 1);
    }
  } else {
    if (targetIndex !== -1) {
      overrideDays[targetIndex].overrideDay = overrideDay;
    } else {
      overrideDays.push({year, month, date, overrideDay});
    }
  }

  write();
};
