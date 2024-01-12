// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0027RequestMessage from './BaseArc0027RequestMessage';

// types
import type { IArc0027SignTxnsParams } from '@common/types';

export default class Arc0027SignTxnsRequestMessage extends BaseArc0027RequestMessage<IArc0027SignTxnsParams> {
  constructor(params: IArc0027SignTxnsParams) {
    super(Arc0027MessageReferenceEnum.SignTxnsRequest, params);
  }
}
