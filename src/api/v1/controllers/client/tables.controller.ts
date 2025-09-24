import { Request, Response } from "express";
import Table from "../../models/tables.model";
import Item from "../../models/items.model";
import Order from "../../models/order.model";

// [PATCH] /api/v1/tables/add-item/:table_id
export const addItemTable = async (req: Request, res: Response) => {
  try {
    const table_id: string = req.params.table_id;
    const quantity: number = parseInt(req.body.quantity);
    const item_id: string = req.body.item_id;

    const table = await Table.findOne({ _id: table_id });

    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại"
      });
    }

    const existsProductCart = table?.items.find(item => item.item_id === item_id);

    if (existsProductCart) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
      let quantityNew = quantity + (existsProductCart.quantity ?? 0);

      await Table.updateOne({
        _id: table_id,
        'items.item_id': item_id
      }, {
        $set: { 'items.$.quantity': quantityNew }
      });
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
      const item = await Item.findOne({ deleted: false, status: "active", _id: item_id }).select("title price thumbnail");

      const items = {
        item_id: item_id,
        quantity: quantity,
        title: item?.title,
        price: item?.price,
        thumbnail: item?.thumbnail
      }

      await Table.updateOne({
        _id: table_id
      }, {
        $push: { items: items },
        state: "ordering"
      });

    }

    const currentTable = await Table.findOne({ _id: table_id });

    const totalItems = currentTable?.items.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0;

    return res.status(200).json({
      code: 200,
      message: "Thêm vào giỏ hàng thành công",
      totalQuantityItem: totalItems,
    });

  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi thêm vào giỏ hàng",
      error: error.message
    });
  }
}

// [GET] /api/v1/tables/get-table/:table_id
export const getTableById = async (req: Request, res: Response) => {
  try {
    const table_id: string = req.params.table_id;

    const table = await Table.findOne({ _id: table_id });

    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại"
      });
    }

    const totalQuantityItem = table?.items.reduce((acc, item) => acc + (item.quantity ?? 0), 0);

    return res.status(200).json({
      code: 200,
      message: "Lấy thông tin bàn thành công",
      table: table,
      totalQuantityItem: totalQuantityItem
    });

  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi lấy thông tin bàn",
      error: error!.message
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

// [PATCh] /api/v1/tables/update/:table_id
export const updateTable = async (
  req: Request<UpdateTableParams, {}, UpdateTableBody>,
  res: Response
) => {
  try {
    const { table_id } = req.params;
    const { item_id, type } = req.body;

    const table = await Table.findOne({ _id: table_id });

    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại",
      });
    }

    const existsProductCart = table?.items.find(item => item.item_id === item_id);

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
            $pull: { items: { item_id } },
            state: "ordering",
            // $inc: { total_order: - (existsProductCart.price ?? 0) }
          }
        );
        return res.status(200).json({
          code: 200,
          message: "Cập nhật bàn thành công",
        });
      }

      // table.total_order = (table.total_order ?? 0) - (existsProductCart.price ?? 0);

    } else if (type === "addition") {
      quantityNew = (existsProductCart.quantity ?? 0) + 1;
      // table.total_order = (table.total_order ?? 0) + (existsProductCart.price ?? 0);
    } else if (type === "removal") {
      await Table.updateOne(
        { _id: table_id },
        {
          $pull: { items: { item_id } },
          state: "ordering",
          // $inc: { total_order: -((existsProductCart.quantity ?? 0) * (existsProductCart.price ?? 0)) }
        }
      );
      return res.status(200).json({
        code: 200,
        message: "Xóa sản phẩm khỏi bàn thành công"
      });
    }

    // cập nhật số lượng
    existsProductCart.quantity = quantityNew;

    table.state = "ordering";
    await table.save();

    return res.status(200).json({
      code: 200,
      message: "Cập nhật bàn thành công",
    });
  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi cập nhật bàn",
      error: error.message,
    });
  }
};

// [GET] /api/v1/tables/order/:table_id
export const orderTable = async (req: Request<UpdateTableParams>, res: Response) => {
  try {
    const { table_id } = req.params;

    const table = await Table.findOne({ _id: table_id });

    if (!table) {
      return res.status(404).json({
        code: 404,
        message: "Bàn không tồn tại",
      });
    }

    const order = await Order.findOne({ table_id: table_id, code: table.current_code });

    if (!order) {
      // khi chưa tạo đơn hàng, thì tạo mới
      const newOrder = {
        table_id: table._id,
        items: table.items,
        total_order: table?.items.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0)
      }
      const createOrder = new Order(newOrder);
      await createOrder.save();
      table.current_code = createOrder.code;
    } else {
      // khi đã tạo rồi mà đặt thêm thì cập nhật lại items
      for (const item of table.items) {
        const existsItemOrder = order?.items.find(i => i.item_id === item.item_id);

        if (existsItemOrder) {
          // Nếu đã tồn tại thì cộng dồn số lượng
          const quantityNew = (item.quantity ?? 0) + (existsItemOrder.quantity ?? 0);

          const orderedIndex = order.items.findIndex(
            orderedItem => orderedItem.item_id === item.item_id
          );

          if (orderedIndex !== -1) {
            order.items[orderedIndex].quantity = quantityNew;
          }

          // Cập nhật lại tổng đơn hàng
          order.total_order = (order.total_order ?? 0) + ((item.price ?? 0) * (item.quantity ?? 0));
        } else {
          // Nếu sản phẩm chưa tồn tại trong đơn hàng, thêm sản phẩm mới
          const item_ordering = await Item.findOne({ deleted: false, status: "active", _id: item.item_id })
            .select("title price thumbnail");

          const itemNew = {
            item_id: item.item_id,
            quantity: (item.quantity ?? 0),
            title: item_ordering?.title,
            price: item_ordering?.price,
            thumbnail: item_ordering?.thumbnail
          }

          order.items.push(itemNew);

          // Cập nhật lại tổng đơn hàng
          order.total_order = (order.total_order ?? 0) + ((item.price ?? 0) * (item.quantity ?? 0));
        }
      }

      await order.save();
    }


    // cập nhật lại ordered
    for (const item of table.items) {
      const existsItemCart = table?.items_ordered.find(i => i.item_id === item.item_id);

      if (existsItemCart) {
        // Nếu đã tồn tại thì cộng dồn số lượng
        const quantityNew = (item.quantity ?? 0) + (existsItemCart.quantity ?? 0);

        const orderedIndex = table.items_ordered.findIndex(
          orderedItem => orderedItem.item_id === item.item_id
        );

        if (orderedIndex !== -1) {
          table.items_ordered[orderedIndex].quantity = quantityNew;
        }
      } else {
        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
        const item_ordering = await Item.findOne({ deleted: false, status: "active", _id: item.item_id })
          .select("title price thumbnail");

        const itemNew = {
          item_id: item.item_id,
          quantity: (item.quantity ?? 0),
          title: item_ordering?.title,
          price: item_ordering?.price,
          thumbnail: item_ordering?.thumbnail
        }

        table.items_ordered.push(itemNew);
      }
    }

    // Cập nhật trạng thái bàn
    table.state = "ordered";
    table.items.splice(0, table.items.length);

    await table.save();

    return res.status(200).json({
      code: 200,
      message: "Đặt hàng thành công",
    });
  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi đặt hàng",
      error: error.message,
    });
  }
}

// [GET] /api/v1/tables/detail-order/:order_code
export const getDetailOrder = async (req: Request, res: Response) => {
  try {
    const order_code = req.params.order_code;
    const order = await Order.findOne({ code: order_code, status: "success"});

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

  } catch (error : any) {
    res.json({
      code: 500,
      message: "Lỗi server khi lấy chi tiết hóa đơn",
      error: error?.message
    });
  }
}