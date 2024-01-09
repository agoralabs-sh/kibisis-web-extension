// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0013RequestMessage from './BaseArc0013RequestMessage';

// types
import type { IArc0013SignTxnsParams } from '@common/types';

export default class Arc0013SignTxnsRequestMessage extends BaseArc0013RequestMessage<IArc0013SignTxnsParams> {
  constructor(params: IArc0013SignTxnsParams) {
    super(Arc0013MessageReferenceEnum.SignTxnsRequest, params);
  }
}
