import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthirizedError } from "../errors/not-authorized-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthirizedError();
  }
  next();
};
