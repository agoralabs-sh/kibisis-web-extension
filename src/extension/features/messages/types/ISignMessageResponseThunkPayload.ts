import type { ISignMessageParams } from '@agoralabs-sh/avm-web-provider';

// features
import type { IBaseResponseThunkPayload } from '@extension/features/messages';

interface ISignMessageResponseThunkPayload
  extends IBaseResponseThunkPayload<ISignMessageParams> {
  signature: string | null;
  signer: string | null;
}

export default ISignMessageResponseThunkPayload;
