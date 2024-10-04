import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthirizedError,
  OrderStatusEnum,
  RequestValidatorError,
} from "@kkticketing01/common";
import { stripe } from "../stripe";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { PaymentCreatedPublisher } from "../events/publishers/PaymentCreatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();
router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidatorError(errors.array());
    }
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthirizedError();
    }

    if (order.status === OrderStatusEnum.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    // to create a payment
    // stripe handles payment in cents only so multiply by 100
    // to test that payment through postman, we can enter token as "tok_visa "
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    return res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
