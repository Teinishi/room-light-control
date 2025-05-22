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
  weekdays: number[]
};

const dbp = JSONFilePreset<ScheduleStoreSchema>(
  path.join(process.env.STORE_DIRECTORY as string, 'schedules.json'),
  { schedules: [], nextId: 0 }
);

let timeoutId: ReturnType<typeof setTimeout>;
const write = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => await (await dbp).write(), 1000);
}

export const getSchedules = async () => (await dbp).data;

export const addSchedule = async (schedule: ScheduleItemSchema) => {
  const db = await dbp;

  schedule.id = db.data.nextId++;
  schedule.enabled ??= true;
  schedule.hour ??= 0;
  schedule.minute ??= 0;
  schedule.weekdays ??= [];

  db.data.schedules.push(schedule);
  write();
  return schedule;
};

export const deleteSchedule = async (id: number) => {
  const db = await dbp;

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

export const updateSchedule = async (id: number, func: (schedule: ScheduleItemSchema) => void) => {
  const db = await dbp;

  const schedule = db.data.schedules.find(s => s.id == id);
  if (schedule) {
    func(schedule)
    write();
    return true;
  } else {
    return false;
  }
};
