import { Indexer, IntDecoding } from 'algosdk';
import SearchForAssets from 'algosdk/dist/types/client/v2/indexer/searchForAssets';

// types
import { IAlgorandSearchAssetsResult } from '@extension/types';

interface IOptions {
  assetId: string | null;
  client: Indexer;
  delay: number;
  limit: number;
  name: string | null;
  next: string | null;
  unit: string | null;
}

/**
 * Searches for assets by the asset index, name or unit from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IAlgorandSearchAssetsResult} applications from the node.
 */
export default async function searchAlgorandAssetsWithDelay({
  assetId,
  client,
  delay,
  limit,
  name,
  next,
  unit,
}: IOptions): Promise<IAlgorandSearchAssetsResult> {
  // if we have no query params, we have no results
  if (!assetId && !unit && !name) {
    return {
      assets: [],
      ['current-round']: BigInt(0),
    };
  }

  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let result: IAlgorandSearchAssetsResult;
      let requestBuilder: SearchForAssets;

      try {
        requestBuilder = client.searchForAssets().limit(limit);

        if (assetId) {
          requestBuilder.index(parseInt(assetId));
        }

        if (name) {
          requestBuilder.name(name);
        }

        if (next) {
          requestBuilder.nextToken(next);
        }

        if (unit) {
          requestBuilder.unit(unit);
        }

        result = (await requestBuilder
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandSearchAssetsResult;

        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
