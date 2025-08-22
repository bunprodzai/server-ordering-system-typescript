import { Router } from "express";
import * as controller from "../../controllers/admin/auth.controller";

const router = Router();

// POST /api/v1/admin/auth/login
router.post("/login", controller.loginPost);

export const authRoutes: Router = router;
