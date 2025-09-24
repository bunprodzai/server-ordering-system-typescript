
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, HashAlgorithm } from "vnpay";
import Item from "../../models/items.model";
import Order from "../../models/order.model";
import VNPayTransactions from "../../models/vnPayTransactions .model";
import { Request, Response } from "express";

// [POST] /vn-pay/create-qr
export const createQr = async (req: Request, res: Response) => {

  const { code, Amount, orderInfo } = req.body;

  const existsVNPay = await VNPayTransactions.findOne({ status: "pending", code_TxnRef: code });

  if (existsVNPay) {
    // nếu khách hàng đã tạo trước đó
    res.status(201).json(existsVNPay.paymentUrl);
    return;
  }

  const vnpay = new VNPay({
    tmnCode: process.env.TMNCODE as string,
    secureSecret: process.env.SECURESECRET as string,
    vnpayHost: 'https://sanbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    loggerFn: ignoreLogger
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const vnpayResponse = await vnpay.buildPaymentUrl({
    vnp_Amount: Number(Amount), // tiền
    vnp_IpAddr: '127.0.0.1', //
    vnp_TxnRef: code, // mã đơn hàng
    vnp_OrderInfo: orderInfo, // thông tin đơn hàng, mô tả đơn hàng
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: `https://server-ordering-system-typescript.app/api/v1/vn-pay/check-payment-vnpay`, //
    vnp_Locale: VnpLocale.VN, // 'vn' or 'en'
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(tomorrow), // 1 ngày sau hết hạn
  });

  // Lưu thông tin đơn hàng lại
  await VNPayTransactions.create({
    code_TxnRef: code,
    amount: Number(Amount),
    orderInfo: orderInfo,
    paymentUrl: vnpayResponse
  });

  return res.status(201).json(vnpayResponse)
}

// [GET] /vn-pay/check-payment-vnpay
export const checkPayment = async (req: Request, res: Response) => {
  const code = req.query.vnp_TxnRef;
  const isSuccess = req.query.vnp_ResponseCode === '00';

  if (isSuccess) {
    await VNPayTransactions.updateOne({ code_TxnRef: code }, { status: "paid" });
    await Order.updateOne({ code: code },
      {
        status: "success",
        paymentMethod: "bank",
        paymentAt: new Date()
      });

    // Redirect về trang frontend
    return res.redirect(`client-ordering-system/success-payment/${code}`);
  } else {
    return res.redirect(`client-ordering-system/order/checkout/pay/fail/${code}`);
  }

  //   {
  //   vnp_Amount: '10000000',
  //   vnp_BankCode: 'NCB',
  //   vnp_BankTranNo: 'VNP15085784',
  //   vnp_OrderInfo: 'order_id1',
  //   vnp_PayDate: '20250720000048',
  //   vnp_ResponseCode: '00',
  //   vnp_TmnCode: 'NQES4APX',
  //   vnp_TransactionNo: '15085784',
  //   vnp_TransactionStatus: '00',
  //   vnp_TxnRef: 'ordercode3',
  //   vnp_SecureHash: '5399289604b942b8263ddc37da1c18c81ae4f6090817a3d7bda6a70a3d7fc3752eb87a10c7fbba402fb5120f6c7896c7326d3fda229a60a27877c432e773ec2a'  
  //   }
}