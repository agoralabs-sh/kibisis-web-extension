// types
import type { IOptions } from './types';

/**
 * Convenience function that simply gets the selected node ID from the settings by a genesis hash.
 * @param {IOptions} options - the genesis hash and the settings.
 * @returns {string | null} the selected node ID by genesis hash in settings, or null if the no selected node exists by
 * the genesis hash.
 */
export default function selectNodeIDByGenesisHashFromSettings({
  genesisHash,
  settings,
}: IOptions): string | null {
  return settings.general.selectedNodeIDs[genesisHash] || null;
}
