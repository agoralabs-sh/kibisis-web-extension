// messages
import { BaseArc0027RequestMessage } from '@common/messages';

// types
import { IArc0027ParamTypes, IClientInformation } from '@common/types';

interface IClientEventPayload {
  clientInfo: IClientInformation;
  originMessage: BaseArc0027RequestMessage<IArc0027ParamTypes>;
  originTabId: number;
}

export default IClientEventPayload;
