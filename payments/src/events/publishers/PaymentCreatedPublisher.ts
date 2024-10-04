import {
  SubjectsEnum,
  PublisherAbstract,
  PaymentCreatedEventInteface,
} from '@kkticketing01/common';

export class PaymentCreatedPublisher extends PublisherAbstract<
  PaymentCreatedEventInteface
> {
  subject: SubjectsEnum.PaymentCreated = SubjectsEnum.PaymentCreated;
}
