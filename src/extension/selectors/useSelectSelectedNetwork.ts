import { useSelector } from 'react-redux';

// Types
import { IMainRootState, INetwork } from '@extension/types';

/**
 * Gets the currently selected network from the settings.
 * @returns {INetwork | null} the current selected network.
 */
export default function useSelectSelectedNetwork(): INetwork | null {
  return useSelector<IMainRootState, INetwork | null>(
    (state) => state.settings.network
  );
}
