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

  /*const createCronTask = async (schedule: ScheduleItemSchema) => {
    if (
      !Number.isInteger(schedule.hour)
        || !Number.isInteger(schedule.minute)
        || !Array.isArray(schedule.weekdays)
        || !schedule.weekdays.every(v => Number.isInteger(v) && 0 <= v && v <= 7)
        || !(await isValidComamnd(schedule.commandType))
    ) {
      return null;
    }
    return cron.schedule(`0 ${schedule.minute} ${schedule.hour} * * ${schedule.weekdays.join(',')}`, () => {
      executeCommand(schedule.commandType);
    });
  };*/

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createCronTask = (schedule: ScheduleItemSchema) => null;

  const tasks = new Map(
    await Promise.all(
      db.data.schedules.map(
        async schedule => [schedule.id, await createCronTask(schedule)] as const
      )
    )
  );

  return {db, write, tasks, createCronTask};
}

const dbContainer = init();

export const getSchedules = async () => (await dbContainer).db.data;

export const addSchedule = async (schedule: ScheduleItemSchema) => {
  const {db, write, tasks, createCronTask} = await dbContainer;

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

export const deleteSchedule = async (id: number) => {
  const {db, write, tasks} = await dbContainer;

  const index = db.data.schedules.findIndex(s => {
    return s.id == id;
  });
  if (index == -1) {
    return false;
  }
  db.data.schedules.splice(index, 1);
  //tasks.get(id)?.stop();
  tasks.delete(id);
  write();
  return true;
};

export const updateSchedule = async (id: number, func: (schedule: ScheduleItemSchema) => ScheduleItemSchema) => {
  const {db, write, tasks, createCronTask} = await dbContainer;

  const index = db.data.schedules.findIndex(s => s.id == id);
  const schedule = db.data.schedules[index];
  if (schedule) {
    //tasks.get(schedule.id)?.stop();
    tasks.delete(schedule.id);
    const newSchedule = func(schedule);
    db.data.schedules[index] = newSchedule;
    tasks.set(newSchedule.id, await createCronTask(newSchedule));
    write();
    return true;
  } else {
    return false;
  }
};
