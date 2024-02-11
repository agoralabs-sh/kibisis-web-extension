// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseARC0027RequestMessage from './BaseARC0027RequestMessage';

// types
import type { IARC0027EnableParams } from '@common/types';

export default class ARC0027EnableRequestMessage extends BaseARC0027RequestMessage<IARC0027EnableParams> {
  constructor(params: IARC0027EnableParams) {
    super(ARC0027MessageReferenceEnum.EnableRequest, params);
  }
}
