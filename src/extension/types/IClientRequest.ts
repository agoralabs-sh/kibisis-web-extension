// messages
import { BaseArc0013RequestMessage } from '@common/messages';

// types
import { IArc0013ParamTypes, IClientInformation } from '@common/types';

interface IClientRequest<
  OriginMessage = BaseArc0013RequestMessage<IArc0013ParamTypes>
> {
  clientInfo: IClientInformation;
  eventId: string;
  originMessage: OriginMessage;
  originTabId: number;
}

export default IClientRequest;
