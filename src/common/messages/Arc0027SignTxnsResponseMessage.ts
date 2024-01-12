// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0027Error } from '@common/errors';

// messages
import BaseArc0027ResponseMessage from './BaseArc0027ResponseMessage';

// types
import type { IArc0027SignTxnsResult } from '@common/types';

export default class Arc0027SignTxnsResponseMessage extends BaseArc0027ResponseMessage<IArc0027SignTxnsResult> {
  constructor(
    requestId: string,
    error: BaseSerializableArc0027Error | null,
    result: IArc0027SignTxnsResult | null
  ) {
    super(
      Arc0027MessageReferenceEnum.SignTxnsResponse,
      requestId,
      error,
      result
    );
  }
}
