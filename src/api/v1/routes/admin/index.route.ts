// file chứa tất cả các route khi chúng ta gọi đến thì sẽ chạy vào
import { Express } from "express";
import { itemRoutes } from "./item.route";
import { authRoutes } from "./auth.route";
import connectMongo from "../../middlewares/connectMongo.middware";
import { requireAuth } from "../../middlewares/admin/auth.middleware";

// Hàm nhận vào app (Express instance)
const adminRoutes = (app: Express) => {
  const prefixAdmin = "admin";

  // middleware kết nối MongoDB
  app.use(connectMongo);

  // các routes của admin
  app.use(`/api/v1/${prefixAdmin}/items`, requireAuth, itemRoutes);

  // app.use(`/api/v1/${prefixAdmin}/products-category`, authMiddleware.requireAuth, productCategoryRoute);

  app.use(`/api/v1/${prefixAdmin}/auth`, authRoutes);
};

export default adminRoutes;
