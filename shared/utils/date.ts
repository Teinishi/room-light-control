const MS_5M = 5*60*1000;
const MS_1H = 60*60*1000;
const MS_1D = 24*60*60*1000;

export type Interval = '5m' | '1h' | '1d';

export function parseInterval(interval: Interval) {
  switch (interval) {
    case '5m':
      return { millisecs: MS_5M, sqliteFormat: '%Y-%m-%dT%H:%M:00Z' };
    case '1h':
      return { millisecs: MS_1H, sqliteFormat: '%Y-%m-%dT%H:00:00Z' };
    case '1d':
      return { millisecs: MS_1D, sqliteFormat: '%Y-%m-%dT00:00:00Z' };
  }
}

export function ceilDate(date: Date, interval: Interval) {
  switch (interval) {
    case '5m':
      return Math.ceil(date.getTime() / MS_5M) * MS_5M;
    case '1h':
      return Math.ceil(date.getTime() / MS_1H) * MS_1H;
    case '1d':
      if (date.getHours() == 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0) {
        return date.getTime();
      }
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0).getTime();
  }
}
