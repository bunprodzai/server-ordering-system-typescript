// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Account from "../../models/accounts.model";
import Role from "../../models/role.model";

interface JwtPayload {
  id: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      code: 400,
      message: "Chưa gửi token!",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      code: 400,
      message: "Không tìm thấy token!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await Account.findOne({ _id: decoded.id }).select("-password");
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Người dùng không tồn tại!",
      });
    }

    const role = await Role.findOne({ _id: user.role_id }).select("permissions title");
    if (!role) {
      return res.status(401).json({
        code: 401,
        message: "Không tìm thấy quyền!",
      });
    }

    req.roles = role.permissions; // gán mảng quyền
    req.userAuth = {
      id: user._id.toString(),
      fullName: user.fullName || "",
    };

    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server!",
    });
  }
};
