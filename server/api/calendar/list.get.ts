import { getOverrideDays } from "~/server/calendarStore";

export default defineEventHandler(async () => await getOverrideDays());
