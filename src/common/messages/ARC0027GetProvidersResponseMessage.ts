// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableARC0027Error } from '@common/errors';

// messages
import BaseARC0027ResponseMessage from './BaseARC0027ResponseMessage';

// types
import type { IARC0027GetProvidersResult } from '@common/types';

export default class ARC0027GetProvidersResponseMessage extends BaseARC0027ResponseMessage<IARC0027GetProvidersResult> {
  constructor(
    requestId: string,
    error: BaseSerializableARC0027Error | null,
    result: IARC0027GetProvidersResult | null
  ) {
    super(
      ARC0027MessageReferenceEnum.GetProvidersResponse,
      requestId,
      error,
      result
    );
  }
}
