// messages
import { BaseArc0013RequestMessage } from '@common/messages';

// types
import { IArc0013ParamTypes, IClientInformation } from '@common/types';

interface IClientEventPayload {
  clientInfo: IClientInformation;
  originMessage: BaseArc0013RequestMessage<IArc0013ParamTypes>;
  originTabId: number;
}

export default IClientEventPayload;
