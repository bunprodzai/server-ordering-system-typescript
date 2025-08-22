import { Router } from "express";
import * as controller from "../../controllers/admin/items.controller";

const router = Router();

// GET /api/v1/admin/items
router.get("/", controller.index);

export const itemRoutes: Router = router;
