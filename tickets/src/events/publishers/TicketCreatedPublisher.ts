import {
    PublisherAbstract,
    SubjectsEnum,
    TicketCreatedEventInterface,
  } from '@kkticketing01/common';
  
  export class TicketCreatedPublisher extends PublisherAbstract<
    TicketCreatedEventInterface
  > {
    subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated;
  }