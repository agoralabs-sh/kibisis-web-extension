// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseInternalMessage from './BaseInternalMessage';

interface IPayload {
  eventId: string;
}

export default class InternalEventAddedMessage extends BaseInternalMessage {
  public readonly payload: IPayload;

  constructor(eventId: string) {
    super(InternalMessageReferenceEnum.EventAdded);

    this.payload = {
      eventId,
    };
  }
}
