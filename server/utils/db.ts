import { DatabaseSync } from 'node:sqlite';

export const useSensorDB = () => {
  const db = new DatabaseSync(process.env.SENSOR_DATABASE!);
  db.exec('PRAGMA journal_mode = WAL;');
  return db;
}
