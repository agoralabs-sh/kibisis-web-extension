// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0013Error } from '@common/errors';

// messages
import BaseArc0013Message from './BaseArc0013Message';

export default class BaseArc0013ResponseMessage<
  Result
> extends BaseArc0013Message {
  public readonly error: BaseSerializableArc0013Error | null;
  public readonly requestId: string;
  public readonly result: Result | null;

  constructor(
    reference: Arc0013MessageReferenceEnum,
    requestId: string,
    error: BaseSerializableArc0013Error | null,
    result: Result | null
  ) {
    super(reference);

    this.error = error;
    this.requestId = requestId;
    this.result = result;
  }
}
