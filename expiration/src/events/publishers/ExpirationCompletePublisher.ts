import {
  SubjectsEnum,
  PublisherAbstract,
  ExpirationCompleteEventInterface,
} from "@kkticketing01/common";

export class ExpirationCompletePublisher extends PublisherAbstract<ExpirationCompleteEventInterface> {
  subject: SubjectsEnum.ExpirationComplete = SubjectsEnum.ExpirationComplete;
}
