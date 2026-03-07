const FIVE_MINUTES = 5*60*1000;
const ONE_HOUR = 60*60*1000;
const ONE_DAY = 24*60*60*1000;

export type Interval = '5m' | '1h' | '1d';

export function parseInterval(interval: Interval) {
  switch (interval) {
    case '5m':
      return { millisecs: FIVE_MINUTES, sqliteFormat: '%Y-%m-%dT%H:%M:00Z' };
    case '1h':
      return { millisecs: ONE_HOUR, sqliteFormat: '%Y-%m-%dT%H:00:00Z' };
    case '1d':
      return { millisecs: ONE_DAY, sqliteFormat: '%Y-%m-%dT00:00:00Z' };
  }
}

export function ceilDate(date: Date, interval: Interval) {
  switch (interval) {
    case '5m':
      return Math.ceil(date.getTime() / FIVE_MINUTES) * FIVE_MINUTES;
    case '1h':
      return Math.ceil(date.getTime() / ONE_HOUR) * ONE_HOUR;
    case '1d':
      if (date.getHours() == 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0) {
        return date.getTime();
      }
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0).getTime();
  }
}
