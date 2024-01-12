// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0027Error } from '@common/errors';

// messages
import BaseArc0027ResponseMessage from './BaseArc0027ResponseMessage';

// types
import type { IArc0027GetProvidersResult } from '@common/types';

export default class Arc0027GetProvidersResponseMessage extends BaseArc0027ResponseMessage<IArc0027GetProvidersResult> {
  constructor(
    requestId: string,
    error: BaseSerializableArc0027Error | null,
    result: IArc0027GetProvidersResult | null
  ) {
    super(
      Arc0027MessageReferenceEnum.GetProvidersResponse,
      requestId,
      error,
      result
    );
  }
}
