import { updateOverrideDay } from "~/server/calendarStore";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let date: Date;
  try {
    date = new Date(Date.UTC(body.year, body.month - 1, body.date));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(err) {
    setResponseStatus(event, 400);
    return;
  }

  await updateOverrideDay(date, body.overrideDay);
  return;
});
