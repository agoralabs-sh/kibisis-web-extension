// enums
import { ClientEventTypeEnum } from '@extension/enums';

// messages
import { BaseArc0013RequestMessage } from '@common/messages';

// types
import { IArc0013ParamTypes, IClientInformation } from '@common/types';

interface IClientEvent {
  clientInfo: IClientInformation;
  id: string;
  message: BaseArc0013RequestMessage<IArc0013ParamTypes>;
  originTabId: number;
  type: ClientEventTypeEnum;
}

export default IClientEvent;
