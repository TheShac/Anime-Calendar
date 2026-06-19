import { Router } from "express";
import {
  getPublicCalendar,
  getNextCalendar,
  getAllCalendarEntries,
  createCalendarEntry,
  updateCalendarEntry,
  deleteCalendarEntry,
} from "./calendar.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getPublicCalendar);
router.get("/next", getNextCalendar);

// Admin
router.get("/admin", verifyToken, getAllCalendarEntries);
router.post("/admin", verifyToken, createCalendarEntry);
router.put("/admin/:id", verifyToken, updateCalendarEntry);
router.delete("/admin/:id", verifyToken, deleteCalendarEntry);

export default router;