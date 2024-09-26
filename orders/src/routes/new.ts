import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatusEnum,
  RequestValidatorError,
  requireAuth,
} from "@kkticketing01/common";
import { body, validationResult } from "express-validator";
import { Ticket } from "../../models/Ticket";
import { Order } from "../../models/Order";
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
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

    const { ticketId } = req.body;
    // find the ticket in db
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //make sure ticket is not reserver at the moment(someone not booking this) , if ticket status is created, awaitoing payment, completed then it is reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //calculate expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //build order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatusEnum.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    return res.status(201).send(order);

    //publish event that order is created

  }
);

export { router as newOrderRouter };
