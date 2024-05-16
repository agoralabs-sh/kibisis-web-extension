import type { IEnableParams } from '@agoralabs-sh/avm-web-provider';
import { useSelector } from 'react-redux';

// types
import type { IClientRequestEvent, IMainRootState } from '@extension/types';

/**
 * Selects the current enable request, or null if none exists.
 * @returns {IClientRequestEvent<IEnableParams> | null} the current enable request or null if it does not exist.
 */
export default function useSelectEnableRequest(): IClientRequestEvent<IEnableParams> | null {
  return useSelector<IMainRootState, IClientRequestEvent<IEnableParams> | null>(
    (state) => state.events.enableRequest
  );
}
