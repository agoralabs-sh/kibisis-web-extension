// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import type { INetwork } from '@extension/types';

/**
 * Convenience function to check if a list of networks contains only stable (mainnet) networks.
 * @param {INetwork[]} networks - the list of networks to check.
 * @returns {boolean} true if the list of networks contains only stable (mainnet) networks, false otherwise.
 */
export default function containsOnlyStableNetworks(
  networks: INetwork[]
): boolean {
  return networks.every((value) => value.type === NetworkTypeEnum.Stable);
}
