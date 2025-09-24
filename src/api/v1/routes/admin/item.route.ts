import { Router } from "express";
import * as controller from "../../controllers/admin/items.controller";
import { checkPermission } from "../../middlewares/admin/checkPermission.middleware"
const router = Router();

// GET /api/v1/admin/items
router.get("/", checkPermission("products_view"), controller.index);

router.post("/create-item", checkPermission("products_create"), controller.createItem);

router.patch("/edit-item/:id", checkPermission("products_edit"), controller.editItem);

router.get("/change-status/:status/:id", checkPermission("products_edit"), controller.changeStatus);

router.delete("/delete-item/:id", checkPermission("products_del"), controller.deleteItem);

export const itemRoutes: Router = router;
