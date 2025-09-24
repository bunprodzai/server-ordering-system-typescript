import { Router } from 'express';
import * as vnPayController from '../../controllers/client/vnpay.controller';

const router = Router();

router.post("/create-qr" ,vnPayController.createQr);
router.get("/check-payment-vnpay" ,vnPayController.checkPayment);

export const vnPayRoutes: Router = router;