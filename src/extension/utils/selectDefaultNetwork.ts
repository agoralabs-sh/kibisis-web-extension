// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import { INetwork, INetworkWithTransactionParams } from '@extension/types';

/**
 * Convenience function that simply gets the default network, either the first stable network, or the first network in
 * the list.
 * @param {<T extends INetwork | INetworkWithTransactionParams>[]} networks - a list of networks to select the default network from.
 * @returns {<T extends INetwork | INetworkWithTransactionParams>} the default network.
 */
export default function selectDefaultNetwork<
  T extends INetwork | INetworkWithTransactionParams
>(networks: T[]): T {
  return (
    networks.find((value) => value.type === NetworkTypeEnum.Test) || networks[0]
  );
}
