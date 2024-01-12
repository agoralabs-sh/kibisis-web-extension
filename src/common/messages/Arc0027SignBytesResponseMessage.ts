// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0027Error } from '@common/errors';

// messages
import BaseArc0027ResponseMessage from './BaseArc0027ResponseMessage';

// types
import type { IArc0027SignBytesResult } from '@common/types';

export default class Arc0027SignBytesResponseMessage extends BaseArc0027ResponseMessage<IArc0027SignBytesResult> {
  constructor(
    requestId: string,
    error: BaseSerializableArc0027Error | null,
    result: IArc0027SignBytesResult | null
  ) {
    super(
      Arc0027MessageReferenceEnum.SignBytesResponse,
      requestId,
      error,
      result
    );
  }
}
