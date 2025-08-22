import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config(); // lấy nội dung trong file .env

const app:Express = express();
const port: number | string = process.env.PORT || 8001;

import cors from "cors"; // dùng để cho phép frontend truy cập vào backend
import bodyParser from "body-parser"; // lấy dữ liệu từ body gửi lên
// import * as cookieParser from "cookie-parser"; // Middleware để xử lý cookie

app.use(bodyParser.json()); // dùng để patch json lên 

app.use(cors());

// app.use(cookieParser());

import adminRoutes from "./api/v1/routes/admin/index.route";
// import routeClient from "./api/v1/routes/client/index.route";

adminRoutes(app);
// routeClient(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});