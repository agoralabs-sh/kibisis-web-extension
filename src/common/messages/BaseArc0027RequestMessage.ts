// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseMessage from './BaseMessage';

export default class BaseArc0027RequestMessage<
  Params
> extends BaseMessage<Arc0027MessageReferenceEnum> {
  public readonly params: Params | null;

  constructor(reference: Arc0027MessageReferenceEnum, params: Params | null) {
    super(reference);

    this.params = params;
  }
}
