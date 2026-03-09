import { z } from 'zod';
import { toISO } from '~~/server/utils';
import { useSensorDB } from '~~/server/utils/db';
import { type Interval, parseInterval, ceilDate } from '~~/shared/utils/date';

const MAX_POINTS = 5000;

const querySchema = z.object({
  from: z.iso.datetime(),
  to: z.iso.datetime(),
  interval: z.enum(['5m', '1h', '1d']).default('5m')
});

export default defineEventHandler((event) => {
  const parsed = querySchema.safeParse(getQuery(event));
  if (!parsed.success) {
    const issues = parsed.error.issues;

    const message = issues
      .map(issue => {
        const field = issue.path.join('.');
        return `${field}: ${issue.message}`;
      })
      .join(', ');

    throw createError({
      statusCode: 400,
      statusMessage: message
    });
  }

  const interval = (parsed.data.interval as Interval) || '5m';
  const { millisecs, sqliteFormat } = parseInterval(interval);
  const from = new Date(parsed.data.from as string);
  const to = new Date(parsed.data.to as string);
  const from_t = ceilDate(from, interval);
  const to_t = to.getTime();

  if (isNaN(from_t) || isNaN(to_t) || to_t < from_t) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date' });
  }

  const n = Math.floor((to_t - from_t) / millisecs);
  if (n > MAX_POINTS) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Too many data points'
    });
  }

  const db = useSensorDB();
  const stmt = db.prepare(`
    SELECT
      strftime('${sqliteFormat}', timestamp) as t,
      AVG(temperature) as temperature,
      AVG(humidity) as humidity
    FROM sensor_data
    WHERE timestamp BETWEEN ? AND ?
    GROUP BY t
    ORDER BY t
  `);
  const rows = stmt.all(toISO(from), toISO(to));
  const data_map = new Map(rows.map(v => [new Date(v.t as string).getTime(), v]));

  const data = [];
  for (let t = from_t; t < to_t; t += millisecs) {
    const v = data_map.get(t);
    data.push({
      t: toISO(new Date(t)),
      temperature: v?.temperature,
      humidity: v?.humidity
    });
  }

  return {
    from: toISO(from),
    to: toISO(to),
    interval,
    data
  };
});
