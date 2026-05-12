import { Router } from "express";

import publicRoutes from "./portals/public.routes.js";
import adminRoutes from "./portals/admin.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.use("/api", publicRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;