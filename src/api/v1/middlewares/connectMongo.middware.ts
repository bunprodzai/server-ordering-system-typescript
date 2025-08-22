import { connect } from "../../../config/database";
import { Request, Response, NextFunction } from "express";

const connectMongo = async (req: Request, res: Response, next: NextFunction) => {
  await connect();
  next();
};

export default connectMongo;