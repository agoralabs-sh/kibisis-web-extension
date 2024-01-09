// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0013Message from './BaseArc0013Message';

export default class BaseArc0013RequestMessage<
  Params
> extends BaseArc0013Message {
  public readonly params: Params | null;

  constructor(reference: Arc0013MessageReferenceEnum, params: Params | null) {
    super(reference);

    this.params = params;
  }
}
