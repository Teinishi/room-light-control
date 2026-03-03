import { deleteSchedule } from "~~/server/scheduleStore";

export default defineEventHandler(async event => {
  const id_s = getRouterParam(event, 'id');
  if (!id_s) {
    setResponseStatus(event, 400);
    return;
  }
  const id = parseInt(id_s as string, 10);

  if (await deleteSchedule(id)) {
    setResponseStatus(event, 204);
  } else {
    setResponseStatus(event, 400);
  }
});
