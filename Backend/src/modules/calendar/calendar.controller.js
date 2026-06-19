import {
  getPublicCalendarService, getNextSeasonCalendarService,
  getAllCalendarEntriesService, createCalendarEntryService,
  updateCalendarEntryService, deleteCalendarEntryService,
} from "./calendar.service.js";

export async function getPublicCalendar(req, res, next) {
  try {
    const data = await getPublicCalendarService();
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getNextCalendar(req, res, next) {
  try {
    const data = await getNextSeasonCalendarService();
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getAllCalendarEntries(req, res, next) {
  try {
    const entries = await getAllCalendarEntriesService();
    res.json({ success: true, data: entries });
  } catch (error) { next(error); }
}

export async function createCalendarEntry(req, res, next) {
  try {
    const entry = await createCalendarEntryService(req.body);
    res.status(201).json({ success: true, message: "Calendar entry created", data: entry });
  } catch (error) { next(error); }
}

export async function updateCalendarEntry(req, res, next) {
  try {
    const entry = await updateCalendarEntryService(Number(req.params.id), req.body);
    res.json({ success: true, message: "Calendar entry updated", data: entry });
  } catch (error) { next(error); }
}

export async function deleteCalendarEntry(req, res, next) {
  try {
    const entry = await deleteCalendarEntryService(Number(req.params.id));
    res.json({ success: true, message: "Calendar entry deleted", data: entry });
  } catch (error) { next(error); }
}