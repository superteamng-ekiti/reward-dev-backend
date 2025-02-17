import { NextFunction, Request, Response } from "express";
import { MONGO_URI } from "../utils/environment";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin_pwd = req.get("x-admin-password") || "";
  if (admin_pwd == MONGO_URI.split("appName=")[1]) {
    next();
  } else {
    return res.status(403).json({
      message: "Unauthorised",
      response: "looks like you don't have priviledges to hit this route"
    });
  }
};
