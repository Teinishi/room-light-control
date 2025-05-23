import path from 'path';
import { JSONFilePreset } from 'lowdb/node';

export interface ScheduleStoreSchema {
  schedules: ScheduleItemSchema[],
  nextId: number
};

export interface ScheduleItemSchema {
  id: number,
  enabled: boolean,
  hour: number,
  minute: number,
  weekdays: number[],
  commandType: string,
};

export const scheduleItemSchemaCheck = (value: unknown) => value && typeof value === 'object'
    && (!('enabled' in value) || typeof value.enabled === 'boolean')
    && (!('hour' in value) || typeof value.hour === 'number')
    && (!('minute' in value) || typeof value.minute === 'number')
    && (!('weekdays' in value) || (Array.isArray(value.weekdays) && value.weekdays.every(v => typeof v === 'number')))
    && (!('commandType' in value) || typeof value.commandType === 'string');

async function init() {
  const db = await JSONFilePreset<ScheduleStoreSchema>(
    path.join(process.env.STORE_DIRECTORY as string, 'schedules.json'),
    { schedules: [], nextId: 0 }
  );

  let timeoutId: ReturnType<typeof setTimeout>;
  const write = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => await db.write(), 1000);
  };

  return {db, write};
}

const dbContainer = init();

export const getSchedules = async () => (await dbContainer).db.data;

export const addSchedule = async (schedule: ScheduleItemSchema) => {
  const {db, write} = await dbContainer;

  schedule.id = db.data.nextId++;
  schedule.enabled ??= true;
  schedule.hour ??= 0;
  schedule.minute ??= 0;
  schedule.weekdays ??= [];
  schedule.commandType ??= 'light_high';

  db.data.schedules.push(schedule);
  write();
  return schedule;
};

export const deleteSchedule = async (id: number) => {
  const {db, write} = await dbContainer;

  const index = db.data.schedules.findIndex(s => {
    return s.id == id;
  });
  if (index == -1) {
    return false;
  }
  db.data.schedules.splice(index, 1);
  write();
  return true;
};

export const updateSchedule = async (id: number, func: (schedule: ScheduleItemSchema) => ScheduleItemSchema) => {
  const {db, write} = await dbContainer;

  const index = db.data.schedules.findIndex(s => s.id == id);
  const schedule = db.data.schedules[index];
  if (schedule) {
    const newSchedule = func(schedule);
    db.data.schedules[index] = newSchedule;
    write();
    return true;
  } else {
    return false;
  }
};
