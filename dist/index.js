"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // lấy nội dung trong file .env
const app = (0, express_1.default)();
const port = process.env.PORT || 8001;
const cors_1 = __importDefault(require("cors")); // dùng để cho phép frontend truy cập vào backend
const body_parser_1 = __importDefault(require("body-parser")); // lấy dữ liệu từ body gửi lên
// import * as cookieParser from "cookie-parser"; // Middleware để xử lý cookie
app.use(body_parser_1.default.json()); // dùng để patch json lên 
app.use((0, cors_1.default)());
// app.use(cookieParser());
// import adminRoutes from "./api/v1/routes/admin/index.route";
// import routeClient from "./api/v1/routes/client/index.route";
// adminRoutes(app);
// routeClient(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
