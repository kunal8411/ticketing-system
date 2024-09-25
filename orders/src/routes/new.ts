import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { RequestValidatorError, requireAuth } from "@kkticketing01/common";
import { body, validationResult } from "express-validator";
const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      //the ticket id should be of mongo db id
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidatorError(errors.array());
    }
    res.send({});
  }
);

export { router as newOrderRouter };
