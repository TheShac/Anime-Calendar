import { Router } from "express";

import {
  getAllSeasons,
  getActiveSeason,
  createSeason,
  updateSeason,
  deleteSeason,
  activateSeason,
} from "./season.controller.js";

import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * PUBLIC
 */
router.get("/active", getActiveSeason);

/**
 * ADMIN
 */
router.get("/", verifyToken, getAllSeasons);

router.post("/", verifyToken, createSeason);

router.put("/:id", verifyToken, updateSeason);

router.delete("/:id", verifyToken, deleteSeason);

router.patch("/:id/activate", verifyToken, activateSeason);

export default router;
