import { Request, Response } from "express"
import Order from "../../models/order.model";

// [GET] /api/v1/admin/orders
export const index = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    res.json({
      code: 200,
      message: "Quản lý đơn hàng",
      orders: orders
    });
  } catch (error: any) {
    res.json({
      code: 400,
      message: `Lỗi ${error?.message}`
    });
  }
}

// [POST] /api/v1/admin/orders/detail/:order_id
export const detailOrder = async (req: Request, res: Response) => {
  try {
    const order_id = req.params.order_id;

    const order = await Order.find({ _id: order_id }).lean();

    res.json({
      code: 200,
      message: "Chi tiết đơn hàng",
      order: order
    });
  } catch (error: any) {
    res.json({
      code: 400,
      message: `Lỗi ${error?.message}`
    });
  }
}