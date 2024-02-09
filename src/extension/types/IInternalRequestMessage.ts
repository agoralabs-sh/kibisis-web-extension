// messages
import { BaseARC0027RequestMessage } from '@common/messages';
import { IARC0027ParamTypes, IClientInformation } from '@common/types';

interface IInternalRequestMessage {
  clientInfo: IClientInformation;
  data: BaseARC0027RequestMessage<IARC0027ParamTypes>;
}

export default IInternalRequestMessage;
