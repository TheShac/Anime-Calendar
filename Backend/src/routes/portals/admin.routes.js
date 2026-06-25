import { Router } from "express";

import { verifyToken } from "../../middlewares/auth.middleware.js";
import animeRoutes from "../../modules/animes/anime.routes.js";
import calendarRoutes from "../../modules/calendar/calendar.routes.js";
import seasonRoutes from "../../modules/seasons/season.routes.js";
import jikanRoutes from "../../modules/jikan/jikan.routes.js";

const router = Router();

router.use(verifyToken);
router.use("/animes", animeRoutes);
router.use("/seasons", seasonRoutes);
router.use("/calendar", calendarRoutes);
router.use("/jikan", jikanRoutes);

export default router;