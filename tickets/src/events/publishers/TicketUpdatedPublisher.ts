import {
  PublisherAbstract,
  SubjectsEnum,
  TicketUpdatedEventInterface,
} from "@kkticketing01/common";

export class TicketUpdatedPublisher extends PublisherAbstract<TicketUpdatedEventInterface> {
  subject: SubjectsEnum.TicketUpdated = SubjectsEnum.TicketUpdated;
}
