// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0013Error } from '@common/errors';

// messages
import BaseArc0013ResponseMessage from './BaseArc0013ResponseMessage';

// types
import type { IArc0013SignTxnsResult } from '@common/types';

export default class Arc0013SignTxnsResponseMessage extends BaseArc0013ResponseMessage<IArc0013SignTxnsResult> {
  constructor(
    requestId: string,
    error: BaseSerializableArc0013Error | null,
    result: IArc0013SignTxnsResult | null
  ) {
    super(
      Arc0013MessageReferenceEnum.SignTxnsResponse,
      requestId,
      error,
      result
    );
  }
}
