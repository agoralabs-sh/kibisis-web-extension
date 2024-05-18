import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// enums
import { EventTypeEnum } from '@extension/enums';

// events
import BaseEvent from './BaseEvent';

// types
import type {
  IClientRequestEvent,
  IClientRequestEventPayload,
} from '@extension/types';

export interface INewOptions<Params extends TRequestParams> {
  id: string;
  payload: IClientRequestEventPayload<Params>;
}

export default class ClientRequestEvent<Params extends TRequestParams>
  extends BaseEvent<IClientRequestEventPayload<Params>>
  implements IClientRequestEvent<Params>
{
  public type: EventTypeEnum.ClientRequest;

  constructor({ id, payload }: INewOptions<Params>) {
    super();

    this.id = id;
    this.payload = payload;
    this.type = EventTypeEnum.ClientRequest;
  }
}
