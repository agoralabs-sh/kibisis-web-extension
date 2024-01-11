// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0013Error } from '@common/errors';

// messages
import BaseArc0013ResponseMessage from './BaseArc0013ResponseMessage';

// types
import type { IArc0013SignBytesResult } from '@common/types';

export default class Arc0013SignBytesResponseMessage extends BaseArc0013ResponseMessage<IArc0013SignBytesResult> {
  constructor(
    requestId: string,
    error: BaseSerializableArc0013Error | null,
    result: IArc0013SignBytesResult | null
  ) {
    super(
      Arc0013MessageReferenceEnum.SignBytesResponse,
      requestId,
      error,
      result
    );
  }
}
