
import { Router } from 'express';
import * as tableController from '../../controllers/admin/tables.controller';

const router = Router();

// GET /api/v1/client/items - Get all items
router.get('/', tableController.index);

router.get('/all', tableController.getAllTable);

router.post('/create-item', tableController.createItem);

router.patch('/edit-item/:id', tableController.editItem);

router.get("/change-status/:status/:id", tableController.changeStatus);

router.delete("/delete-item/:id", tableController.deleteItem);

router.get("/cancel-table/:table_id", tableController.getCancelTable);

router.get("/success/:table_id/:order_code", tableController.successTable);

router.patch('/update/:table_id', tableController.updateTable);

router.get('/detail-order/:table_id/:order_code', tableController.getDetailOrder);

router.get('/:table_id', tableController.detailTable);

export const tableRoutes: Router = router;