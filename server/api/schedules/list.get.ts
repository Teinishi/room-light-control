import { getSchedules } from "~/server/scheduleStore";

export default defineEventHandler(async () => await getSchedules());
