import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// messages
import { ClientRequestMessage } from '@common/messages';

interface IClientRequestEventPayload<Params extends TRequestParams> {
  message: ClientRequestMessage<Params>;
  originTabId: number;
}

export default IClientRequestEventPayload;
