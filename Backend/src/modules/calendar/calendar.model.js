import { db } from "../../config/db.js";
import { calendarEntries } from "./calendar.schema.js";
import { animes } from "../animes/anime.schema.js";
import { seasons } from "../seasons/season.schema.js";
import { eq } from "drizzle-orm";

/**
 * GET PUBLIC CALENDAR — un solo query con todo
 */
export async function findPublicCalendar() {
  const rows = await db
    .select({
      entryId:     calendarEntries.id,
      dayOfWeek:   calendarEntries.dayOfWeek,
      time:        calendarEntries.time,
      animeId:     animes.id,
      title:       animes.title,
      imageUrl:    animes.imageUrl,
      description: animes.description,
      status:      animes.status,
      seasonId:    seasons.id,
      seasonName:  seasons.name,
      seasonSlug:  seasons.slug,
      isActive:    seasons.isActive,
    })
    .from(calendarEntries)
    .innerJoin(animes,   eq(calendarEntries.animeId,   animes.id))
    .innerJoin(seasons,  eq(calendarEntries.seasonId,  seasons.id))
    .where(eq(seasons.isActive, true));

  return rows;
}

/**
 * GET ALL ADMIN
 */
export async function findAllCalendarEntries() {
  return await db
    .select({
      id:         calendarEntries.id,
      dayOfWeek:  calendarEntries.dayOfWeek,
      time:       calendarEntries.time,
      animeId:    animes.id,
      animeTitle: animes.title,
      animeImage: animes.imageUrl,
      seasonId:   seasons.id,
      seasonName: seasons.name,
    })
    .from(calendarEntries)
    .leftJoin(animes,  eq(calendarEntries.animeId,  animes.id))
    .leftJoin(seasons, eq(calendarEntries.seasonId, seasons.id));
}

export async function findCalendarEntryById(id) {
  const [entry] = await db
    .select()
    .from(calendarEntries)
    .where(eq(calendarEntries.id, id));
  return entry;
}

export async function insertCalendarEntry(data) {
  const [entry] = await db
    .insert(calendarEntries)
    .values(data)
    .returning();
  return entry;
}

export async function updateCalendarEntryById(id, data) {
  const [entry] = await db
    .update(calendarEntries)
    .set(data)
    .where(eq(calendarEntries.id, id))
    .returning();
  return entry;
}

export async function deleteCalendarEntryById(id) {
  const [entry] = await db
    .delete(calendarEntries)
    .where(eq(calendarEntries.id, id))
    .returning();
  return entry;
}