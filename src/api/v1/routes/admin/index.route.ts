// file chứa tất cả các route khi chúng ta gọi đến thì sẽ chạy vào
import { Express } from "express";
import { itemRoutes } from "./item.route";
import { authRoutes } from "./auth.route";
import { categoryRoutes } from "./category.route";

import connectMongo from "../../middlewares/connectMongo.middware";
import { requireAuth } from "../../middlewares/admin/auth.middleware";
import { tableRoutes } from "./table.route";
import { orderRoutes } from "./order.route";

// Hàm nhận vào app (Express instance)
const adminRoutes = (app: Express) => {
  const prefixAdmin = "admin";

  // middleware kết nối MongoDB
  app.use(connectMongo);

  // các routes của admin
  app.use(`/api/v1/${prefixAdmin}/auth`, authRoutes);

  app.use(`/api/v1/${prefixAdmin}/items`, requireAuth, itemRoutes);

  app.use(`/api/v1/${prefixAdmin}/categories`, requireAuth, categoryRoutes);

  app.use(`/api/v1/${prefixAdmin}/tables`, requireAuth, tableRoutes);

  app.use(`/api/v1/${prefixAdmin}/orders`, requireAuth, orderRoutes);

};

export default adminRoutes;
