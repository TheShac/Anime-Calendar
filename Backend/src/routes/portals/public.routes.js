import { Router } from "express";
import calendarRoutes from "../../modules/calendar/calendar.routes.js";

const router = Router();

router.use("/calendar", calendarRoutes);

export default router;