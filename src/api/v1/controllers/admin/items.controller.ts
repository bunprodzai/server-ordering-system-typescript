import { Request, Response } from "express"
import Item from "../../models/items.model";
import { paginationHelper } from "../../helpers/pagination";
import { searchHelper } from "../../helpers/search";
// import { IItem } from "../../interfaces/item.interface";
// import { searchHelper } from "../../../../helpers/search";

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
