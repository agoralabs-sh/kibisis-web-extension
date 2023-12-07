// enums
import { MessageTypeEnum } from '@common/enums';

// messages
import { BaseMessage } from '@common/messages';

interface IPayload {
  eventId: string;
}

export default class EventAddedMessage extends BaseMessage {
  public readonly payload: IPayload;

  constructor(eventId: string) {
    super(MessageTypeEnum.EventAdded);

    this.payload = {
      eventId,
    };
  }
}
