// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseARC0027RequestMessage from './BaseARC0027RequestMessage';

// types
import type { IARC0027SignTxnsParams } from '@common/types';

export default class ARC0027SignTxnsRequestMessage extends BaseARC0027RequestMessage<IARC0027SignTxnsParams> {
  constructor(params: IARC0027SignTxnsParams) {
    super(ARC0027MessageReferenceEnum.SignTxnsRequest, params);
  }
}
