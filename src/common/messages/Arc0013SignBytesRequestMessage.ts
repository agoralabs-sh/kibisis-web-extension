// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0013RequestMessage from './BaseArc0013RequestMessage';

// types
import type { IArc0013SignBytesParams } from '@common/types';

export default class Arc0013SignBytesRequestMessage extends BaseArc0013RequestMessage<IArc0013SignBytesParams> {
  constructor(params: IArc0013SignBytesParams) {
    super(Arc0013MessageReferenceEnum.SignBytesRequest, params);
  }
}
