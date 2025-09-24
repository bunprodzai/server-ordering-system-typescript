import { Request, Response } from "express"
import Item from "../../models/items.model";
import { paginationHelper } from "../../helpers/pagination";
import { searchHelper } from "../../helpers/search";

// [GET] /api/v1/admin/items
export const index = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_view")) {
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

    const countItem: number = await Item.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countItem
    );
    // end phân trang

    // Tìm kiếm
    const objSearch = searchHelper(req.query);

    if (objSearch.regex) {
      find.title = objSearch.regex;
    }
    // /api/v1/products?keyword=samsung url để search
    // end Tìm kiếm

    // sort
    const sort: Record<string, any> = {}
    if (req.query.sortKey && req.query.sortType) {
      const sortKey = Array.isArray(req.query.sortKey) ? req.query.sortKey[0] : req.query.sortKey;
      const sortType = Array.isArray(req.query.sortType) ? req.query.sortType[0] : req.query.sortType;
      if (typeof sortKey === "string" && typeof sortType === "string") {
        sort[sortKey] = sortType; // [] dùng để truyền linh động, còn sort.sortKey là truyền cứng
      }
    }
    // }/api/v1/products?sortKey=price&sortType=asc url để query
    // end sort

    const items = await Item.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    res.json({
      code: 200,
      items: items,
      totalPage: objectPagination.totalPage
    });
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền xem sản phẩm!"
    });
  }
}

// [POST] /api/v1/admin/items/create-item
export const createItem = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_create")) {
    try {

      if (!req.body.position) {
        const countItem = await Item.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const newItem = new Item(req.body);
      await newItem.save();
      res.json({
        code: 201,
        message: "Tạo sản phẩm thành công!",
        item: newItem
      });
    } catch (error: any) {
      res.json({
        code: 500,
        message: "Tạo sản phẩm thất bại!",
        error: error.message
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền tạo sản phẩm!"
    });
  }
}

// [PATCH] /api/v1/admin/items/edit-item/:id
export const editItem = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_edit")) {
    try {
      const id: string = req.params.id;

      const item = await Item.findById(id);


      if (!item) {
        return res.status(404).json({
          code: 404,
          message: "Sản phẩm không tồn tại!"
        });
      }

      if (!req.body.position) {
        const countItem = await Item.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const { ...dataEdit } = req.body;

      const updateQuery = {
        $set: dataEdit // mọi field khác
      }

      console.log(updateQuery);


      await Item.updateOne({ _id: id }, updateQuery)

      res.json({
        code: 200,
        message: "Chỉnh sửa sản phẩm thành công!"
      });
    } catch (error: any) {
      res.json({
        code: 500,
        message: "Tạo sản phẩm thất bại!",
        error: error.message
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền tạo sản phẩm!"
    });
  }
}

// [PATCH] /api/v1/admin/items/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_edit")) {
    try {
      const status: string = req.params.status;
      const id: string = req.params.id;

      const item = await Item.findById(id);

      if (!item) {
        res.json({
          code: 404,
          message: "Sản phẩm không tồn tại"
        });
        return;
      }

      await Item.updateOne({ _id: id }, { status: status });

      res.json({
        code: 200,
        message: "Thay đổi trạng thái sản phẩm thành công!"
      });

    } catch (error: any) {
      res.json({
        code: 500,
        message: "Thay đổi trạng thái sản phẩm không thành công!",
        error: error.message
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền chỉnh sửa sản phẩm!"
    });
  }
}

// [DELETE] /api/v1/items/delete-item/:id
export const deleteItem = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_del")) {
    try {
      const id: string = req.params.id;
      
      const item = await Item.findById(id);

      if (!item) {
        res.json({
          code: 404,
          message: "Sản phẩm không tồn tại"
        });
        return;
      }

      console.log(item);
      

      await Item.updateOne({ _id: id }, { deleted: true });

      res.json({
        code: 200,
        message: "Xóa sản phẩm thành công!"
      });

    } catch (error: any) {
      res.json({
        code: 500,
        message: "Xóa sản phẩm không thành công!",
        error: error.message
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền xóa sản phẩm!"
    });
  }

}