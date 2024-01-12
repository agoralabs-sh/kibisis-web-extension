// messages
import { BaseArc0027RequestMessage } from '@common/messages';
import { IArc0027ParamTypes, IClientInformation } from '@common/types';

interface IInternalRequestMessage {
  clientInfo: IClientInformation;
  data: BaseArc0027RequestMessage<IArc0027ParamTypes>;
}

export default IInternalRequestMessage;
