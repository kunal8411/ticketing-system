import { Message } from "node-nats-streaming";
import {
  ListenerAbstract,
  OrderCreatedEventInterface,
  SubjectsEnum,
} from "@kkticketing01/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export class OrderCreatedListener extends ListenerAbstract<OrderCreatedEventInterface> {
  subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEventInterface["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });

    await ticket.save();

    //need to emmit this event because, when we save any document using .save() the version gets incremented and to keep same version in order service ticket collection also, we need to emmit this event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
