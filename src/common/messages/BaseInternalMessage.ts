// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseMessage from './BaseMessage';

export default class BaseInternalMessage extends BaseMessage<InternalMessageReferenceEnum> {
  constructor(reference: InternalMessageReferenceEnum) {
    super(reference);
  }
}
