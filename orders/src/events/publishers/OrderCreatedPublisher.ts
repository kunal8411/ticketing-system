import {
    PublisherAbstract,
    OrderCreatedEventInterface,
    SubjectsEnum,
  } from '@kkticketing01/common';
  
  export class OrderCreatedPublisher extends PublisherAbstract<
    OrderCreatedEventInterface
  > {
    subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
  }