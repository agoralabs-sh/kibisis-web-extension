// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0027RequestMessage from './BaseArc0027RequestMessage';

// types
import type { IArc0027EnableParams } from '@common/types';

export default class Arc0027EnableRequestMessage extends BaseArc0027RequestMessage<IArc0027EnableParams> {
  constructor(params: IArc0027EnableParams) {
    super(Arc0027MessageReferenceEnum.EnableRequest, params);
  }
}
