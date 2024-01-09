// messages
import { BaseArc0013RequestMessage } from '@common/messages';
import { IArc0013ParamTypes, IClientInformation } from '@common/types';

interface IInternalRequestMessage {
  clientInfo: IClientInformation;
  data: BaseArc0013RequestMessage<IArc0013ParamTypes>;
}

export default IInternalRequestMessage;
