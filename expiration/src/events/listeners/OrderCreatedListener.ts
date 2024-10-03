import { Message } from "node-nats-streaming";
import {
  ListenerAbstract,
  OrderCreatedEventInterface,
  SubjectsEnum,
} from "@kkticketing01/common";
import { queueGroupName } from "./queueGroupName";
import { expirationQueue } from "../../../src/queues/expiration-queue";

export class OrderCreatedListener extends ListenerAbstract<OrderCreatedEventInterface> {
  subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEventInterface["data"], msg: Message) {
    // to add 15 min delay, data.expiresAt we add the time 15 minutes later when we create new order in order service.
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    //add job in the queue
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
