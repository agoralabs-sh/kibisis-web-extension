// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseMessage from './BaseMessage';

export default class BaseARC0027RequestMessage<
  Params
> extends BaseMessage<ARC0027MessageReferenceEnum> {
  public readonly params: Params | null;

  constructor(reference: ARC0027MessageReferenceEnum, params: Params | null) {
    super(reference);

    this.params = params;
  }
}
