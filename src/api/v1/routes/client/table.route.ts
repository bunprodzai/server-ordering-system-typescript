import { Router } from 'express';
import * as tablesController from '../../controllers/client/tables.controller';

const router = Router();

// GET /api/v1/client/items - Get all items
router.patch('/add-item/:table_id', tablesController.addItemTable);

router.get('/get-table/:table_id', tablesController.getTableById);

router.patch('/update/:table_id', tablesController.updateTable);

router.get('/order/:table_id', tablesController.orderTable);

router.get('/detail-order/:order_code', tablesController.getDetailOrder);

export const tablesRoutes: Router = router;