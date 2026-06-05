import { Router } from "express";

import {
  getAnimes,
  getAnime,
  createAnimeController,
  updateAnimeController,
  deleteAnimeController,
} from "./anime.controller.js";

const router = Router();

/**
 * GET ALL
 */
router.get("/", getAnimes);

/**
 * GET ONE
 */
router.get("/:id", getAnime);

/**
 * CREATE
 */
router.post("/", createAnimeController);

/**
 * UPDATE
 */
router.put("/:id", updateAnimeController);

/**
 * DELETE
 */
router.delete("/:id", deleteAnimeController);

export default router;
