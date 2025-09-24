import { Request, Response } from "express"
import Item from "../../models/items.model";
import Category from "../../models/categories.model";

// [GET] /api/v1/admin/items/find/:idCategory
export const index = async (req: Request, res: Response) => {

  const idCategory = req.params.idCategory;

  const items = await Item.find({ category_id: idCategory, 
    status: 'active', deleted: false }).lean();

  res.json({
    code: 200,
    items: items,
    message: "Items fetched successfully"
  });
}

// [GET] /api/v1/admin/items/categories
export const listCategory = async (req: Request, res: Response) => {

  const categories = await Category.find({deleted: false, status: 'active'});

  res.json({
    code: 200,
    categories: categories
  });
}