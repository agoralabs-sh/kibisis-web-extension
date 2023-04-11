import { useSelector } from 'react-redux';

// Enums
import { NetworkTypeEnum } from '@extension/enums';

// Types
import { IMainRootState, INetwork } from '@extension/types';

/**
 * Fetches all the available networks. Availability is subject to the settings.
 * @returns {INetwork[]} the available networks.
 */
export default function useSelectNetworks(): INetwork[] {
  return useSelector<IMainRootState, INetwork[]>(({ networks, settings }) =>
    networks.items.filter((value) => {
      switch (value.type) {
        case NetworkTypeEnum.Beta:
          return settings.advanced.allowBetaNet;
        case NetworkTypeEnum.Test:
          return settings.advanced.allowTestNet;
        case NetworkTypeEnum.Stable:
        default:
          return true;
      }
    })
  );
}
