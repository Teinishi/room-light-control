import { JSONFilePreset } from 'lowdb/node';

export interface ScheduleStoreSchema {
  schedules: ScheduleItemSchema[]
};

export interface ScheduleItemSchema {
  id: number,
  enabled: boolean,
  hour: number,
  minute: number,
  weekdays: number[]
};

const db = JSONFilePreset<ScheduleStoreSchema>('schedules.json', { schedules: [] });

export const getSchedules = async () => (await db).data;
