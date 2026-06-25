import { Router } from "express";
import { searchAnimes } from "./jikan.controller.js";

const router = Router();

router.get("/search", searchAnimes);

export default router;
