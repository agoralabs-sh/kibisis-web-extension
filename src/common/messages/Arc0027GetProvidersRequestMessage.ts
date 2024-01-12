// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0027RequestMessage from './BaseArc0027RequestMessage';

// types
import type { IArc0027GetProvidersParams } from '@common/types';

export default class Arc0027GetProvidersRequestMessage extends BaseArc0027RequestMessage<IArc0027GetProvidersParams> {
  constructor(params: IArc0027GetProvidersParams | null) {
    super(Arc0027MessageReferenceEnum.GetProvidersRequest, params);
  }
}
