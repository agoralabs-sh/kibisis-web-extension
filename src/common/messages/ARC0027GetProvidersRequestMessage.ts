// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

// messages
import BaseARC0027RequestMessage from './BaseARC0027RequestMessage';

// types
import type { IARC0027GetProvidersParams } from '@common/types';

export default class ARC0027GetProvidersRequestMessage extends BaseARC0027RequestMessage<IARC0027GetProvidersParams> {
  constructor(params: IARC0027GetProvidersParams | null) {
    super(ARC0027MessageReferenceEnum.GetProvidersRequest, params);
  }
}
