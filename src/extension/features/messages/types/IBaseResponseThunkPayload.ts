import {
  BaseARC0027Error,
  TRequestParams,
} from '@agoralabs-sh/avm-web-provider';

// events
import type { IClientRequestEvent } from '@extension/types';

interface IBaseResponseThunkPayload<RequestParams extends TRequestParams> {
  error: BaseARC0027Error | null;
  event: IClientRequestEvent<RequestParams>;
}

export default IBaseResponseThunkPayload;
