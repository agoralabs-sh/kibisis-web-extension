// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0013RequestMessage from './BaseArc0013RequestMessage';

// types
import type { IArc0013EnableParams } from '@common/types';

export default class Arc0013EnableRequestMessage extends BaseArc0013RequestMessage<IArc0013EnableParams> {
  constructor(params: IArc0013EnableParams) {
    super(Arc0013MessageReferenceEnum.EnableRequest, params);
  }
}
