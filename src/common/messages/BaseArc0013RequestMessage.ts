// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// messages
import BaseMessage from './BaseMessage';

export default class BaseArc0013RequestMessage<
  Params
> extends BaseMessage<Arc0013MessageReferenceEnum> {
  public readonly params: Params | null;

  constructor(reference: Arc0013MessageReferenceEnum, params: Params | null) {
    super(reference);

    this.params = params;
  }
}
