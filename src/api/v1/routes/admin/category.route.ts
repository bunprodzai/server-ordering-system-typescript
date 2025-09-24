import { Router } from 'express';
import * as categoriesController from '../../controllers/admin/categories.controller';

const router = Router();

// GET /api/v1/admin/categories - Get all categories
router.get('/', categoriesController.index);

router.post("/create-item", categoriesController.createItem);

router.patch("/edit-item/:id", categoriesController.editItem);

router.get("/change-status/:status/:id", categoriesController.changeStatus);

router.delete("/delete-item/:id", categoriesController.deleteItem);

export const categoryRoutes: Router = router;