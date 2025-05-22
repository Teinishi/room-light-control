import { getSchedules } from "../scheduleStore";

export default defineEventHandler(async () => await getSchedules());
