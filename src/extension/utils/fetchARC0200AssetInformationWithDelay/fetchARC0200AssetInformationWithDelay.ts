import { Algodv2, Indexer } from 'algosdk';
import ARC0200Contract from 'arc200js';

// types
import { IARC0200AssetInformation } from '@extension/types';

interface IOptions {
  algodClient: Algodv2;
  delay: number;
  id: string;
  indexerClient: Indexer;
}

/**
 * Fetches ARC-0200 asset information from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IARC0200AssetInformation | null} ARC-0200 asset information from the node.
 */
export default async function fetchARC0200AssetInformationWithDelay({
  algodClient,
  delay,
  id,
  indexerClient,
}: IOptions): Promise<IARC0200AssetInformation | null> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      const contract: ARC0200Contract = new ARC0200Contract(
        parseInt(id),
        algodClient,
        indexerClient
      );
      let result: { returnValue: IARC0200AssetInformation; success: boolean };

      try {
        result = await contract.getMetadata();

        if (!result.success) {
          resolve(null);

          return;
        }

        resolve(result.returnValue);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
