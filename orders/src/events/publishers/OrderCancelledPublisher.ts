import {
    PublisherAbstract,
    OrderCancelledEventInterface,
    SubjectsEnum,
  } from '@kkticketing01/common';
  
  export class OrderCancelledPublisher extends PublisherAbstract<
    OrderCancelledEventInterface
  > {
    subject: SubjectsEnum.OrderCancelled = SubjectsEnum.OrderCancelled;
  }