// types
import type { IARC0072AssetHolding, IARC0072Indexer } from '@extension/types';
import type { IOptions } from './types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

/**
 * Fetches ARC-0072 asset holdings from the node ARC-0072 indexer with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IARC0072AssetHolding[]} the ARC-0072 asset holdings.
 */
export default async function fetchARC0072AssetHoldingsWithDelay({
  address,
  delay,
  logger,
  network,
}: IOptions): Promise<IARC0072AssetHolding[]> {
  const _functionName = 'fetchARC0072AssetHoldingsWithDelay';
  const arc0072Indexer =
    getRandomItem<IARC0072Indexer>(network.arc0072Indexers) || null;

  if (!arc0072Indexer) {
    logger?.debug(
      `${_functionName}: no arc-0072 indexers found for network "${network.genesisId}"`
    );

    return [];
  }

  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let result: IARC0072AssetHolding[];

      try {
        result = await arc0072Indexer.fetchTokensByOwner({
          address,
          logger,
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
