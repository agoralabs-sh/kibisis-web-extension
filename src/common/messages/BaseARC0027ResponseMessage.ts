// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableARC0027Error } from '@common/errors';

// messages
import BaseMessage from './BaseMessage';

export default class BaseARC0027ResponseMessage<
  Result
> extends BaseMessage<ARC0027MessageReferenceEnum> {
  public readonly error: BaseSerializableARC0027Error | null;
  public readonly requestId: string;
  public readonly result: Result | null;

  constructor(
    reference: ARC0027MessageReferenceEnum,
    requestId: string,
    error: BaseSerializableARC0027Error | null,
    result: Result | null
  ) {
    super(reference);

    this.error = error;
    this.requestId = requestId;
    this.result = result;
  }
}
