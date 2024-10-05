import { Message } from 'node-nats-streaming';
import {
  SubjectsEnum,
  ListenerAbstract,
  PaymentCreatedEventInteface,
  OrderStatusEnum,
} from '@kkticketing01/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/Order';

export class PaymentCreatedListener extends ListenerAbstract<
  PaymentCreatedEventInteface
> {
  subject: SubjectsEnum.PaymentCreated = SubjectsEnum.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEventInteface['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatusEnum.Complete,
    });
    //here we are saving the document hence version will be incremented, but in our app as status is competed now, we dont need to emmit any ither event to other services 
    await order.save();

    msg.ack();
  }
}
