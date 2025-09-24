import { Request, Response, NextFunction } from "express";

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.roles || !req.roles.includes(permission)) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền truy cập!",
      });
    }
    next();
  };
};
