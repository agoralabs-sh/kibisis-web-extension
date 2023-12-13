import { Algodv2 } from 'algosdk';
import Arc200Contract from 'arc200js';

// types
import { IArc200AssetInformation } from '@extension/types';

interface IOptions {
  client: Algodv2;
  delay: number;
  id: string;
}

/**
 * Fetches ARC200 asset information from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IArc200AssetInformation | null} ARC200 asset information from the node.
 */
export default async function fetchArc200AssetInformationWithDelay({
  client,
  delay,
  id,
}: IOptions): Promise<IArc200AssetInformation | null> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      const contract: Arc200Contract = new Arc200Contract(
        parseInt(id),
        client,
        undefined
      );
      let result: { returnValue: IArc200AssetInformation; success: boolean };

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
