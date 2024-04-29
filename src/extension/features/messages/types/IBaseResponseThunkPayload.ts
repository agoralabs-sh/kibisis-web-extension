import {
  BaseARC0027Error,
  TRequestParams,
} from '@agoralabs-sh/avm-web-provider';

// types
import type { IClientRequestEventPayload, IEvent } from '@extension/types';

interface IBaseResponseThunkPayload<Params = TRequestParams> {
  error: BaseARC0027Error | null;
  event: IEvent<IClientRequestEventPayload<Params>>;
}

export default IBaseResponseThunkPayload;
