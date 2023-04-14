import { Algodv2, IntDecoding } from 'algosdk';

// Types
import { IAlgorandAsset } from '@extension/types';

interface IOptions {
  client: Algodv2;
  delay: number;
  id: string;
}

/**
 * Fetches asset information from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IAlgorandAsset} asset information from the node.
 */
export default async function fetchAssetInformationWithDelay({
  client,
  delay,
  id,
}: IOptions): Promise<IAlgorandAsset> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let assetInformation: IAlgorandAsset;

      try {
        assetInformation = (await client
          .getAssetByID(parseInt(id))
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAsset;

        resolve(assetInformation);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
