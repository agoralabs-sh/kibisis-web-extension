import { useSelector } from 'react-redux';

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IMainRootState } from '@extension/types';

/**
 * Gets the currently selected custom node from the settings or null if none are selected.
 * @returns {ICustomNodeItem | null} the current selected custom node from settings, or null.
 */
export default function useSelectSettingsSelectedCustomNode(): ICustomNodeItem | null {
  return useSelector<IMainRootState, ICustomNodeItem | null>(
    ({ customNodes, settings }) => {
      if (!settings.general.selectedCustomNetworkId) {
        return null;
      }

      return (
        customNodes.items.find(
          (value) => value.id === settings.general.selectedCustomNetworkId
        ) || null
      );
    }
  );
}
