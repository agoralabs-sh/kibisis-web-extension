// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

interface IPayload {
  eventId: string;
}

export default class ProviderEventAddedMessage extends BaseProviderMessage {
  public readonly payload: IPayload;

  constructor(eventId: string) {
    super(ProviderMessageReferenceEnum.EventAdded);

    this.payload = {
      eventId,
    };
  }
}
