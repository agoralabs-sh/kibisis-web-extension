// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseARC0027RequestMessage from './BaseARC0027RequestMessage';

// types
import type { IARC0027SignBytesParams } from '@common/types';

export default class ARC0027SignBytesRequestMessage extends BaseARC0027RequestMessage<IARC0027SignBytesParams> {
  constructor(params: IARC0027SignBytesParams) {
    super(ARC0027MessageReferenceEnum.SignBytesRequest, params);
  }
}
