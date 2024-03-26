// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseARC0027RequestMessage from './BaseARC0027RequestMessage';

// types
import type { IARC0027DisableParams } from '@common/types';

export default class ARC0027DisableRequestMessage extends BaseARC0027RequestMessage<IARC0027DisableParams> {
  constructor(params: IARC0027DisableParams) {
    super(ARC0027MessageReferenceEnum.DisableRequest, params);
  }
}
