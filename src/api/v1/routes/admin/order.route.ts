import { Router } from "express";
import * as controller from "../../controllers/admin/orders.controller";
import { checkPermission } from "../../middlewares/admin/checkPermission.middleware"
const router = Router();

// GET /api/v1/admin/orders
router.get("/", checkPermission("products_view"), controller.index);

router.get("/detail/:order_id", checkPermission("products_create"), controller.detailOrder);


export const orderRoutes: Router = router;