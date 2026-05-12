import { findPublicCalendar, findAllCalendarEntries, findCalendarEntryById, insertCalendarEntry, updateCalendarEntryById, deleteCalendarEntryById } from "./calendar.model.js";

/**
 * PUBLIC — un solo query, sin roundtrip extra para la season
 */
export async function getPublicCalendarService() {
  const rows = await findPublicCalendar();

  if (!rows.length) {
    throw new Error("No active season found");
  }

  // toma los datos de season del primer row
  const season = {
    id:       rows[0].seasonId,
    name:     rows[0].seasonName,
    slug:     rows[0].seasonSlug,
    isActive: rows[0].isActive,
  };

  const days = {
    lunes:     [],
    martes:    [],
    miercoles: [],
    jueves:    [],
    viernes:   [],
    sabado:    [],
    domingo:   [],
  };

  rows.forEach((row) => {
    const day = row.dayOfWeek;
    if (days[day] !== undefined) {
      days[day].push({
        id:          row.entryId,
        animeId:     row.animeId,
        title:       row.title,
        imageUrl:    row.imageUrl,
        description: row.description,
        status:      row.status,
        time:        row.time,
        dayOfWeek:   row.dayOfWeek,
      });
    }
  });

  return { season, days };
}

export async function getAllCalendarEntriesService() {
  return await findAllCalendarEntries();
}

export async function createCalendarEntryService(data) {
  return await insertCalendarEntry(data);
}

export async function updateCalendarEntryService(id, data) {
  const entry = await findCalendarEntryById(id);
  if (!entry) throw new Error("Calendar entry not found");
  return await updateCalendarEntryById(id, data);
}

export async function deleteCalendarEntryService(id) {
  const entry = await findCalendarEntryById(id);
  if (!entry) throw new Error("Calendar entry not found");
  return await deleteCalendarEntryById(id);
}