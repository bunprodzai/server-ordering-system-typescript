import { Request, Response } from "express";
import Account from "../../models/accounts.model";
import md5 from "md5";
import Role from "../../models/role.model";
import jwt from "jsonwebtoken";

export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email: email, deleted: false });

    if (!account) {
      res.json({
        code: 400,
        message: "Tài khoản không tồn tại!"
      });
      return;
    }

    if (md5(password) !== account.password) {
      res.json({
        code: 400,
        message: "Mật khẩu không đúng!"
      });
      return;
    }

    if (account.status !== "active") {
      res.json({
        code: 403,
        message: "Tài khoản đã bị khóa!"
      });
      return;
    }

    const permissions = await Role.findOne({ _id: account.role_id });

    const token = jwt.sign(
      { id: account._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token: token,
      id: account._id,
      fullName: account.fullName,
      email: account.email,
      permissions: permissions!.permissions
    });

  } catch (error: any) {
    res.json({
      code: 500,
      message: "Đã xảy ra lỗi!",
      error: error.message
    });
  }
};