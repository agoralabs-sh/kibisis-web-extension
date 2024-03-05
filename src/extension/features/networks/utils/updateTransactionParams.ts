// constants
import { NETWORK_TRANSACTION_PARAMS_ANTIQUATED_TIMEOUT } from '@extension/constants';

// types
import type { IBaseOptions } from '@common/types';
import type {
  IAlgorandTransactionParams,
  INetworkWithTransactionParams,
  INode,
} from '@extension/types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

/**
 * Fetches the transaction params for a give network.
 * @param {INetworkWithTransactionParams} network - the network to query.
 * @param {IBaseOptions} options - base options.
 * @returns {Promise<INetworkWithTransactionParams>} the network with updated transaction params.
 */
export default async function updateTransactionParams(
  network: INetworkWithTransactionParams,
  { logger }: IBaseOptions
): Promise<INetworkWithTransactionParams> {
  const _functionName: string = 'updateTransactionParams';
  let algorandTransactionParams: IAlgorandTransactionParams;
  let algod: INode;
  let response: Response;
  let updatedAt: Date;

  // if the account information is not out-of-date just return the account
  if (
    network.updatedAt &&
    network.updatedAt + NETWORK_TRANSACTION_PARAMS_ANTIQUATED_TIMEOUT >
      new Date().getTime()
  ) {
    logger?.debug(
      `${_functionName}: last updated "${new Date(
        network.updatedAt
      ).toString()}", skipping`
    );

    return network;
  }

  algod = getRandomItem(network.algods);

  logger?.debug(
    `${_functionName}: updating transaction params for network "${network.genesisId}"`
  );

  try {
    // use rest api as the
    response = await fetch(`${algod.url}/v2/transactions/params`);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    algorandTransactionParams = await response.json();

    // check if the genesis hashes match
    if (algorandTransactionParams['genesis-hash'] !== network.genesisHash) {
      logger?.debug(
        `${_functionName}: requested network genesis hash "${network.genesisHash}" does not match the returned genesis hash "${algorandTransactionParams['genesis-hash']}", ignoring`
      );

      return network;
    }

    updatedAt = new Date();

    logger?.debug(
      `${_functionName}: successfully updated transaction params for network "${
        network.genesisId
      }" at "${updatedAt.toString()}"`
    );

    return {
      ...network,
      fee: algorandTransactionParams.fee.toString(),
      minFee: algorandTransactionParams['min-fee'].toString(),
      updatedAt: updatedAt.getTime(),
    };
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get transaction params for network "${network.genesisId}": ${error.message}`
    );

    return network;
  }
}
