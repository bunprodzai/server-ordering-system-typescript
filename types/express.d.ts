// types/express.d.ts
import "express";

interface Account {
  id: string;
  fullName: string;
}

declare module "express-serve-static-core" {
  interface Request {
    roles?: string[];       // mảng quyền
    userAuth?: Account | null; // user hiện tại
  }
}
