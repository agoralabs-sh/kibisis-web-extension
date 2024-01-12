// messages
import { BaseArc0027RequestMessage } from '@common/messages';

// types
import { IArc0027ParamTypes, IClientInformation } from '@common/types';

interface IClientRequest<
  OriginMessage = BaseArc0027RequestMessage<IArc0027ParamTypes>
> {
  clientInfo: IClientInformation;
  eventId: string;
  originMessage: OriginMessage;
  originTabId: number;
}

export default IClientRequest;
