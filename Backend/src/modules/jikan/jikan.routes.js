import { Router } from "express";
import { searchAnimes, getAnimeDetail, importSeason, triggerSync } from "./jikan.controller.js";

const router = Router();

router.get("/search",        searchAnimes);
router.get("/detail/:malId", getAnimeDetail);
router.post("/import",       importSeason);
router.post("/sync",         triggerSync);

export default router;
