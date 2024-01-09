// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// messages
import BaseArc0013RequestMessage from './BaseArc0013RequestMessage';

// types
import type { IArc0013GetProvidersParams } from '@common/types';

export default class Arc0013GetProvidersRequestMessage extends BaseArc0013RequestMessage<IArc0013GetProvidersParams> {
  constructor(params: IArc0013GetProvidersParams | null) {
    super(Arc0013MessageReferenceEnum.GetProvidersRequest, params);
  }
}
