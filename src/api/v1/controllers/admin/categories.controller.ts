
import { Request, Response } from "express";
import Category from "../../models/categories.model";
import { paginationHelper } from "../../helpers/pagination";

// [GET] /api/v1/admin/categories
export const index = async (req: Request, res: Response) => {
  try {
    const limitItem = req.query.limit;

    // phân trang 
    let initPagination = {
      currentPage: 1,
      limitItems: Number(limitItem),
      skip: 0,
      totalPage: 0,
    };

    const countItem: number = await Category.countDocuments({ deleted: false });
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countItem
    );

    const categories = await Category.find({ deleted: false })
      .skip(objectPagination.skip)
      .limit(objectPagination.limitItems);

    // end phân trang
    return res.status(200).json({
      code: 200,
      message: "Lấy danh sách danh mục thành công",
      categories: categories,
      totalPage: objectPagination.totalPage
    });
  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi lấy danh sách danh mục",
      error: error.message
    });
  }

}

// [POST] /api/v1/admin/categories/create-item
export const createItem = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_create")) {
    try {

      if (!req.body.position) {
        const countItem = await Category.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const newCategory = new Category(req.body);
      await newCategory.save();
      res.json({
        code: 201,
        message: "Tạo danh mục thành công!",
        item: newCategory
      });
    } catch (error: any) {
      res.json({
        code: 500,
        message: "Tạo danh mục thất bại!",
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

// [PATCH] /api/v1/admin/categories/edit-item/:id
export const editItem = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_edit")) {
    try {
      const id: string = req.params.id;

      const item = await Category.findById(id);


      if (!item) {
        return res.status(404).json({
          code: 404,
          message: "Sản phẩm không tồn tại!"
        });
      }

      if (!req.body.position) {
        const countItem = await Category.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const { ...dataEdit } = req.body;

      const updateQuery = {
        $set: dataEdit // mọi field khác
      }

      await Category.updateOne({ _id: id }, updateQuery)

      res.json({
        code: 200,
        message: "Chỉnh sửa danh mục thành công!"
      });
    } catch (error: any) {
      res.json({
        code: 500,
        message: "Tạo danh mục thất bại!",
        error: error.message
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền tạo danh mục!"
    });
  }
}

// [GET] /api/v1/categories/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_edit")) {
    try {
      const status: string = req.params.status;
      const id: string = req.params.id;

      const item = await Category.findById(id);

      if (!item) {
        res.json({
          code: 404,
          message: "Danh mục không tồn tại"
        });
        return;
      }

      await Category.updateOne({ _id: id }, { status: status });

      res.json({
        code: 200,
        message: "Thay đổi trạng thái danh mục thành công!"
      });

    } catch (error: any) {
      res.json({
        code: 500,
        message: "Thay đổi trạng thái danh mục không thành công!",
        error: error.message
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền chỉnh sửa sdanh mục!"
    });
  }
}

// [DELETE] /api/v1/categories/delete-item/:id
export const deleteItem = async (req: Request, res: Response) => {
  if (req.roles?.includes("products_del")) {
    try {
      const id: string = req.params.id;
      
      const item = await Category.findById(id);

      if (!item) {
        res.json({
          code: 404,
          message: "Danh mục không tồn tại"
        });
        return;
      }

      await Category.updateOne({ _id: id }, { deleted: true });

      res.json({
        code: 200,
        message: "Xóa danh mục thành công!"
      });

    } catch (error: any) {
      res.json({
        code: 500,
        message: "Xóa danh mục không thành công!",
        error: error.message
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền xóa danh mục!"
    });
  }

}