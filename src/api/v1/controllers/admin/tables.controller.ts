import { Request, Response } from "express"
import Table from "../../models/tables.model";
import { paginationHelper } from "../../helpers/pagination";
import QRCode from "qrcode";
import Order from "../../models/order.model";

// [GET] /api/v1/admin/tables
export const index = async (req: Request, res: Response) => {
  const status = req.query.status;
  const limitItem = req.query.limit; // tổng số bảng item trên 1 page

  const find: { [key: string]: any } = {
    deleted: false
  };

  if (status) {
    find.status = status;
  }

  // phân trang 
  let initPagination = {
    currentPage: 1,
    limitItems: Number(limitItem),
    skip: 0,
    totalPage: 0,
  };

  const countItem: number = await Table.countDocuments(find);
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countItem
  );
  // end phân trang


  const items = await Table.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.json({
    code: 200,
    items: items,
    totalPage: objectPagination.totalPage
  });
}

// [GET] /api/v1/admin/tables/:table_id
export const detailTable = async (req: Request, res: Response) => {
  try {
    const table_id = req.params.table_id;
    const table = await Table.findOne({ _id: table_id, status: "active", deleted: false });

    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại!"
      });
    }

    res.json({
      code: 200,
      message: "Lấy chi tiết bàn thành công!",
      table: table
    });
  } catch (error: any) {
    res.json({
      code: 500,
      message: "Lỗi server khi lấy chi tiết bàn",
      error: error?.message
    });
  }
}

// [POST] /api/v1/admin/tables/create-item
export const createItem = async (req: Request, res: Response) => {
  try {
    const table_number = req.body.table_number;

    const existingTable = await Table.findOne({ table_number: table_number });
    if (existingTable) {
      return res.status(400).json({
        code: 400,
        message: "Bàn đã tồn tại!"
      });
    }

    const newItem = new Table(req.body);

    const qrImageUrl = await QRCode.toDataURL(`https://server-ordering-system-typescript.app/table/order/${newItem._id}`); // tạo base64 URL
    newItem.qr_code = qrImageUrl;
    newItem.state = "available";

    await newItem.save();
    res.json({
      code: 201,
      message: "Tạo bàn thành công!"
    });
  } catch (error: any) {
    res.json({
      code: 500,
      message: "Tạo bàn thất bại!",
      error: error.message
    });
  }
}

// [PATCH] /api/v1/admin/tables/edit-item/:id
export const editItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại!"
      });
    }

    await Table.updateOne({ _id: id }, req.body)

    res.json({
      code: 200,
      message: "Chỉnh sửa bàn thành công!"
    });
  } catch (error: any) {
    res.json({
      code: 500,
      message: "Chỉnh sửa bàn thất bại!",
      error: error.message
    });
  }
}

// [PATCH] /api/v1/admin/tables/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;

    const item = await Table.findById(id);

    if (!item) {
      res.json({
        code: 404,
        message: "Bàn không tồn tại"
      });
      return;
    }

    await Table.updateOne({ _id: id }, { status: status });

    res.json({
      code: 200,
      message: "Thay đổi trạng thái bàn thành công!"
    });

  } catch (error: any) {
    res.json({
      code: 500,
      message: "Thay đổi trạng thái sản phẩm không thành công!",
      error: error.message
    });
  }
}

// [DELETE] /api/v1/tables/delete-item/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const item = await Table.findById(id);

    if (!item) {
      res.json({
        code: 404,
        message: "Bàn không tồn tại"
      });
      return;
    }
    await Table.updateOne({ _id: id }, { deleted: true });
    res.json({
      code: 200,
      message: "Xóa bàn thành công!"
    });

  } catch (error: any) {
    res.json({
      code: 500,
      message: "Xóa sản phẩm không thành công!",
      error: error.message
    });
  }
}

// [GET] /api/v1/tables/all
export const getAllTable = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find({ deleted: false, status: "active" });
    res.json({
      code: 200,
      message: "Lấy danh sách bàn thành công!",
      tables: tables
    });
  } catch (error: any) {
    res.json({
      code: 500,
      message: "Lấy danh sách bàn không thành công!",
      error: error.message
    });
  }
}

// [GET] /api/v1/tables/cancel-table/:table_id
export const getCancelTable = async (req: Request, res: Response) => {
  try {
    const table_id = req.params.table_id;

    const table = await Table.findOne({ _id: table_id });
    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại!"
      });
    }

    await Table.updateOne(
      { _id: table_id },
      {
        items: [],
        items_ordered: [],
        state: "available",
        current_code: ""
      }
    );

    res.json({
      code: 200,
      message: "Hủy bàn thành công!"
    });
  } catch (error: any) {
    res.json({
      code: 500,
      message: "Hủy bàn không thành công",
      error: error.message
    });
  }
}

// [GET] /api/v1/tables/success/:table_id/:order_code
export const successTable = async (req: Request, res: Response) => {
  try {
    const table_id = req.params.table_id;
    const order_code = req.params.order_code;

    const table = await Table.findOne({ _id: table_id });
    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại!"
      });
    }

    const order = await Order.findOne({ code: order_code, table_id: table_id });

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Hóa đơn không tồn tại!"
      });
    }

    // Xử lý thành công
    await Table.updateOne(
      { _id: table_id },
      {
        items: [],
        state: "available",
        items_ordered: [],
        current_code: ""
      }
    );

    if (order.status !== "success") {
      await Order.updateOne({ code: order_code },
        { status: "success", paymentAt: new Date(), paymentMethod: "cod" });
    }

    res.json({
      code: 200,
      message: "Hoàn thành đơn hàng thành công!"
    });
  } catch (error: any) {
    res.json({
      code: 500,
      message: "Hoàn thành đơn hàng không thành công!",
      error: error.message
    });
  }
}

interface UpdateTableBody {
  item_id: string;
  type: "subtraction" | "addition";
}

interface UpdateTableParams {
  table_id: string;
}

// [PATCh] /api/v1/admin/tables/update/:table_id
export const updateTable = async (
  req: Request<UpdateTableParams, {}, UpdateTableBody>,
  res: Response
) => {
  try {
    const { table_id } = req.params;
    const { item_id, type } = req.body;
    console.log(req.body);

    const table = await Table.findOne({ _id: table_id });

    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại",
      });
    }

    const existsProductCart = table?.items_ordered.find(item => item.item_id === item_id);

    if (!existsProductCart) {
      return res.status(404).json({
        code: 404,
        message: "Sản phẩm không tồn tại trong bàn",
      });
    }

    let quantityNew = 0;

    if (type === "subtraction") {
      quantityNew = Math.max(0, (existsProductCart.quantity ?? 0) - 1); // tránh âm

      if (quantityNew === 0) {
        await Table.updateOne(
          { _id: table_id },
          {
            $pull: { items_ordered: { item_id } },
          }
        );
        return res.status(200).json({
          code: 200,
          message: "Cập nhật bàn thành công",
        });
      }
    } else if (type === "addition") {
      quantityNew = (existsProductCart.quantity ?? 0) + 1;
    } else if (type === "removal") {
      await Table.updateOne(
        { _id: table_id },
        {
          $pull: { items_ordered: { item_id } },
        }
      );
      return res.status(200).json({
        code: 200,
        message: "Xóa sản phẩm khỏi bàn thành công"
      });
    }

    // cập nhật số lượng
    existsProductCart.quantity = quantityNew;

    await table.save();

    return res.status(200).json({
      code: 200,
      message: "Cập nhật món đã đặt thành công",
    });
  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi cập nhật bàn",
      error: error.message,
    });
  }
};

// [GET] /api/v1/admin/tables/detail-order/:table_id/:order_code
export const getDetailOrder = async (req: Request, res: Response) => {
  try {
    const order_code = req.params.order_code;
    const table_id = req.params.table_id;
    const order = await Order.findOne({ code: order_code, table_id: table_id });

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Hóa đơn không tồn tại!"
      });
    }

    res.json({
      code: 200,
      message: "Lấy chi tiết hóa đơn thành công!",
      order: order
    });

  } catch (error: any) {
    res.json({
      code: 500,
      message: "Lỗi server khi lấy chi tiết hóa đơn",
      error: error?.message
    });
  }
}
