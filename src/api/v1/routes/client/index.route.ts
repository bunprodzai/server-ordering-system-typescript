import { Express } from "express";

import connectMongo from "../../middlewares/connectMongo.middware";
import { itemsRoutes } from "./items.route";
import { tablesRoutes } from "./table.route";
import { vnPayRoutes } from "./vn-pay.route";

const clientRoutes = (app: Express) => {
  app.use(connectMongo);

  app.use(`/api/v1/items`, itemsRoutes);
  app.use(`/api/v1/tables`, tablesRoutes);
  app.use(`/api/v1/vn-pay`, vnPayRoutes);
}

export default clientRoutes;