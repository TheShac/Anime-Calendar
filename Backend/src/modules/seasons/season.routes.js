import { Router } from "express";
import {
  getAllSeasons, getActiveSeason, getNextSeason,
  createSeason, updateSeason, deleteSeason,
  activateSeason, markAsNext, unmarkAsNext,
} from "./season.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// PUBLIC
router.get("/active", getActiveSeason);
router.get("/next",   getNextSeason);

// ADMIN
router.get("/",                    verifyToken, getAllSeasons);
router.post("/",                   verifyToken, createSeason);
router.put("/:id",                 verifyToken, updateSeason);
router.delete("/:id",              verifyToken, deleteSeason);
router.patch("/:id/activate",      verifyToken, activateSeason);
router.patch("/:id/mark-next",     verifyToken, markAsNext);
router.patch("/:id/unmark-next",   verifyToken, unmarkAsNext);

export default router;