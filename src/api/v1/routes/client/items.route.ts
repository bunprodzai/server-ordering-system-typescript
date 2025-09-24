import { Router } from 'express';
import * as itemsController from '../../controllers/client/items.controller';

const router = Router();

// GET /api/v1/client/items - Get all items
router.get('/find/:idCategory', itemsController.index);
router.get('/categories', itemsController.listCategory);


export const itemsRoutes: Router = router;