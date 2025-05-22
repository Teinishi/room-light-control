import { deleteSchedule } from "~/server/scheduleStore";

export default defineEventHandler(async event => {
  const id = parseInt(getRouterParam(event, 'id') as string, 10);

  if (await deleteSchedule(id)) {
    setResponseStatus(event, 204);
  } else {
    setResponseStatus(event, 400);
  }
});
