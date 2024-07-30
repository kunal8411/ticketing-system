import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidatorError } from "../errors/request-validator-error";
export const validateRequest = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     throw new RequestValidatorError(errors.array());
   }
   next()
};

