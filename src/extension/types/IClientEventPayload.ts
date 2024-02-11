// messages
import { BaseARC0027RequestMessage } from '@common/messages';

// types
import { IARC0027ParamTypes, IClientInformation } from '@common/types';

interface IClientEventPayload {
  clientInfo: IClientInformation;
  originMessage: BaseARC0027RequestMessage<IARC0027ParamTypes>;
  originTabId: number;
}

export default IClientEventPayload;
