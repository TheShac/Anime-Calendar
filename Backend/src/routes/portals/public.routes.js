import { Router } from "express";
import calendarRoutes from "../../modules/calendar/calendar.routes.js";
import seasonRoutes   from "../../modules/seasons/season.routes.js";
import { getPublicAnimeDetail } from "../../modules/jikan/jikan.controller.js";

const router = Router();

router.use("/calendar", calendarRoutes);
router.use("/seasons",  seasonRoutes);
router.get("/anime/:malId/detail", getPublicAnimeDetail);

export default router;