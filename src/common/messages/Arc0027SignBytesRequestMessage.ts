// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0027RequestMessage from './BaseArc0027RequestMessage';

// types
import type { IArc0027SignBytesParams } from '@common/types';

export default class Arc0027SignBytesRequestMessage extends BaseArc0027RequestMessage<IArc0027SignBytesParams> {
  constructor(params: IArc0027SignBytesParams) {
    super(Arc0027MessageReferenceEnum.SignBytesRequest, params);
  }
}
