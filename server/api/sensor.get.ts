import { z } from 'zod';
import { toISO } from '~~/server/utils';
import { useSensorDB } from '~~/server/utils/db';

type Interval = '5m' | '1h' | '1d';

const MAX_POINTS = 5000;

const querySchema = z.object({
  from: z.iso.datetime(),
  to: z.iso.datetime(),
  interval: z.enum(['5m', '1h', '1d']).default('5m')
})

function parseInterval(interval: Interval) {
  switch (interval) {
    case '5m':
      return { minutes: 5, sqliteFormat: '%Y-%m-%dT%H:%M:00Z' };
    case '1h':
      return { minutes: 60, sqliteFormat: '%Y-%m-%dT%H:00:00Z' };
    case '1d':
      return { minutes: 1440, sqliteFormat: '%Y-%m-%dT00:00:00Z' };
    default:
      throw new Error('Invalid interval');
  }
}

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

  const from = new Date(parsed.data.from as string);
  const to = new Date(parsed.data.to as string);
  const interval = (parsed.data.interval as Interval) || '5m';

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date' });
  }

  const { sqliteFormat } = parseInterval(interval);

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
    LIMIT ?
  `);
  const rows = stmt.all(toISO(from), toISO(to), MAX_POINTS + 1);
  if (rows.length > MAX_POINTS) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Too many data points'
    });
  }

  return {
    from: toISO(from),
    to: toISO(to),
    interval,
    data: rows
  };
});
