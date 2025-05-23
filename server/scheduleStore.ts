import path from 'path';
import { JSONFilePreset } from 'lowdb/node';
import cron from 'node-cron';
import { executeCommand, isValidComamnd } from './command';

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

const createCronTask = (schedule: ScheduleItemSchema) => {
  if (
    !Number.isInteger(schedule.hour)
      || !Number.isInteger(schedule.minute)
      || !Array.isArray(schedule.weekdays)
      || !schedule.weekdays.every(v => Number.isInteger(v) && 0 <= v && v <= 7)
      || !isValidComamnd(schedule.commandType)
  ) {
    return null;
  }
  return cron.schedule(`0 ${schedule.minute} ${schedule.hour} * * ${schedule.weekdays.join(',')}`, () => {
    executeCommand(schedule.commandType);
  });
};

const db = await JSONFilePreset<ScheduleStoreSchema>(
  path.join(process.env.STORE_DIRECTORY as string, 'schedules.json'),
  { schedules: [], nextId: 0 }
);

const tasks = new Map(db.data.schedules.map(schedule => {
  const task = createCronTask(schedule);
  return [schedule.id, task];
}));

let timeoutId: ReturnType<typeof setTimeout>;
const write = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => await db.write(), 1000);
}

export const getSchedules = () => db.data;

export const addSchedule = (schedule: ScheduleItemSchema) => {
  schedule.id = db.data.nextId++;
  schedule.enabled ??= true;
  schedule.hour ??= 0;
  schedule.minute ??= 0;
  schedule.weekdays ??= [];
  schedule.commandType ??= 'light_high';

  db.data.schedules.push(schedule);
  tasks.set(schedule.id, createCronTask(schedule));
  write();
  return schedule;
};

export const deleteSchedule = (id: number) => {
  const index = db.data.schedules.findIndex(s => {
    return s.id == id;
  });
  if (index == -1) {
    return false;
  }
  db.data.schedules.splice(index, 1);
  tasks.get(id)?.stop();
  tasks.delete(id);
  write();
  return true;
};

export const updateSchedule = (id: number, func: (schedule: ScheduleItemSchema) => ScheduleItemSchema) => {
  const index = db.data.schedules.findIndex(s => s.id == id);
  const schedule = db.data.schedules[index];
  if (schedule) {
    tasks.get(schedule.id)?.stop();
    tasks.delete(schedule.id);
    const newSchedule = func(schedule);
    db.data.schedules[index] = newSchedule;
    tasks.set(newSchedule.id, createCronTask(newSchedule));
    write();
    return true;
  } else {
    return false;
  }
};
