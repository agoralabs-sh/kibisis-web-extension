// messages
import { BaseARC0027RequestMessage } from '@common/messages';

// types
import { IARC0027ParamTypes, IClientInformation } from '@common/types';

interface IClientRequest<
  OriginMessage = BaseARC0027RequestMessage<IARC0027ParamTypes>
> {
  clientInfo: IClientInformation;
  eventId: string;
  originMessage: OriginMessage;
  originTabId: number;
}

export default IClientRequest;
