import { Message } from "node-nats-streaming";
import {
  ListenerAbstract,
  ExpirationCompleteEventInterface,
  SubjectsEnum,
  OrderStatusEnum,
} from "@kkticketing01/common";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/Order";
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";

export class ExpirationCompleteListener extends ListenerAbstract<ExpirationCompleteEventInterface> {
  queueGroupName = queueGroupName;
  subject: SubjectsEnum.ExpirationComplete = SubjectsEnum.ExpirationComplete;

  async onMessage(
    data: ExpirationCompleteEventInterface["data"],
    msg: Message
  ) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    } 

    //in between time if payment service send event that payment:created then we change status to complete of the order. so we need to check if payment already complete then acknowledge the event
    if (order.status === OrderStatusEnum.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatusEnum.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}