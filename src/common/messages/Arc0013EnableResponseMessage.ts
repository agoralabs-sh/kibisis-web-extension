// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0013Error } from '@common/errors';

// messages
import BaseArc0013ResponseMessage from './BaseArc0013ResponseMessage';

// types
import type { IArc0013EnableResult } from '@common/types';

export default class Arc0013EnableResponseMessage extends BaseArc0013ResponseMessage<IArc0013EnableResult> {
  constructor(
    requestId: string,
    error: BaseSerializableArc0013Error | null,
    result: IArc0013EnableResult | null
  ) {
    super(Arc0013MessageReferenceEnum.EnableResponse, requestId, error, result);
  }
}
