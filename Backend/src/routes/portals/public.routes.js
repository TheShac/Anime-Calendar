import { Router } from "express";
import calendarRoutes from "../../modules/calendar/calendar.routes.js";
import seasonRoutes   from "../../modules/seasons/season.routes.js";

const router = Router();

router.use("/calendar", calendarRoutes);
router.use("/seasons",  seasonRoutes);

export default router;