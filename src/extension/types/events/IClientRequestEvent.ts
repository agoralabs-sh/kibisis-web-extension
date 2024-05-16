import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type IBaseEvent from './IBaseEvent';
import type IClientRequestEventPayload from './IClientRequestEventPayload';

interface IClientRequestEvent<Params extends TRequestParams>
  extends IBaseEvent<IClientRequestEventPayload<Params>> {
  type: EventTypeEnum.ClientRequest;
}

export default IClientRequestEvent;
