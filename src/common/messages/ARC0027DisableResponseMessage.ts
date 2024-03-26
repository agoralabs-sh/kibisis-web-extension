// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableARC0027Error } from '@common/errors';

// messages
import BaseARC0027ResponseMessage from './BaseARC0027ResponseMessage';

// types
import type { IARC0027DisableResult } from '@common/types';

export default class ARC0027DisableResponseMessage extends BaseARC0027ResponseMessage<IARC0027DisableResult> {
  constructor(
    requestId: string,
    error: BaseSerializableARC0027Error | null,
    result: IARC0027DisableResult | null
  ) {
    super(
      ARC0027MessageReferenceEnum.DisableResponse,
      requestId,
      error,
      result
    );
  }
}
