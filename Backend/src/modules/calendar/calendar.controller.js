import {
  getPublicCalendarService,
  getAllCalendarEntriesService,
  createCalendarEntryService,
  updateCalendarEntryService,
  deleteCalendarEntryService,
} from "./calendar.service.js";

/**
 * PUBLIC
 */
export async function getPublicCalendar(req, res, next) {
  try {
    const data = await getPublicCalendarService();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN GET ALL
 */
export async function getAllCalendarEntries(req, res, next) {
  try {
    const entries = await getAllCalendarEntriesService();

    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * CREATE
 */
export async function createCalendarEntry(req, res, next) {
  try {
    const entry = await createCalendarEntryService(req.body);

    res.status(201).json({
      success: true,
      message: "Calendar entry created",

      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * UPDATE
 */
export async function updateCalendarEntry(req, res, next) {
  try {
    const entry = await updateCalendarEntryService(
      Number(req.params.id),
      req.body,
    );

    res.json({
      success: true,
      message: "Calendar entry updated",

      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE
 */
export async function deleteCalendarEntry(req, res, next) {
  try {
    const entry = await deleteCalendarEntryService(Number(req.params.id));

    res.json({
      success: true,
      message: "Calendar entry deleted",

      data: entry,
    });
  } catch (error) {
    next(error);
  }
}
