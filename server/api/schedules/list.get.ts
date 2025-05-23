import { getSchedules } from "~/server/scheduleStore";

export default defineEventHandler(() => getSchedules());
