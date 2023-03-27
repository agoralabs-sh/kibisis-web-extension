import { useSelector } from 'react-redux';

// Types
import { IMainRootState, INetwork } from '../types';

/**
 * Fetches all the available networks.
 * @returns {INetwork[]} the available networks.
 */
export default function useSelectNetworks(): INetwork[] {
  return useSelector<IMainRootState, INetwork[]>(
    (state) => state.networks.items
  );
}
