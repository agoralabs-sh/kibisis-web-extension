// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableARC0027Error } from '@common/errors';

// messages
import BaseARC0027ResponseMessage from './BaseARC0027ResponseMessage';

// types
import type { IARC0027SignBytesResult } from '@common/types';

export default class ARC0027SignBytesResponseMessage extends BaseARC0027ResponseMessage<IARC0027SignBytesResult> {
  constructor(
    requestId: string,
    error: BaseSerializableARC0027Error | null,
    result: IARC0027SignBytesResult | null
  ) {
    super(
      ARC0027MessageReferenceEnum.SignBytesResponse,
      requestId,
      error,
      result
    );
  }
}
