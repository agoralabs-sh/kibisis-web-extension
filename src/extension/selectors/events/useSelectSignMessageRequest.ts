import type { ISignMessageParams } from '@agoralabs-sh/avm-web-provider';
import { useSelector } from 'react-redux';

// types
import type { IClientRequestEvent, IMainRootState } from '@extension/types';

/**
 * Selects the current sign message request, or null if none exists.
 * @returns {IClientRequestEvent<ISignMessageParams> | null} the current sign message request or null if it does not exist.
 */
export default function useSelectSignMessageRequest(): IClientRequestEvent<ISignMessageParams> | null {
  return useSelector<
    IMainRootState,
    IClientRequestEvent<ISignMessageParams> | null
  >((state) => state.events.signMessageRequest);
}
