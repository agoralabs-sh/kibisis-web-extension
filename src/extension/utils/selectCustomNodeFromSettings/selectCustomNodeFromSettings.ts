// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IOptions } from './types';

/**
 * Convenience function that simply gets the selected custom node from the settings.
 * @param {IOptions} options - a list of custom nodes and the settings.
 * @returns {ICustomNodeItem | null} the selected custom node in settings, or null if the custom node doesn't exist.
 */
export default function selectCustomNodeFromSettings({
  customNodes,
  settings,
}: IOptions): ICustomNodeItem | null {
  if (!settings.general.selectedCustomNetworkId) {
    return null;
  }

  return (
    customNodes.find(
      (value) => value.id === settings.general.selectedCustomNetworkId
    ) || null
  );
}
