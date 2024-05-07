// enums
import { ErrorCodeEnum } from '@extension/enums';

// contracts
import ARC0200Contract from '@extension/contracts/ARC0200Contract';

// types
import type {
  IARC0200AssetInformation,
  IFetchAssetWithDelayOptions,
} from '@extension/types';

/**
 * Fetches ARC-0200 asset information from the node with a delay.
 * @param {IFetchAssetWithDelayOptions} options - options needed to send the request.
 * @returns {IARC0200AssetInformation | null} ARC-0200 asset information or null if the asset is not an ARC-0200 asset.
 */
export default async function fetchARC0200AssetInformationWithDelay({
  delay,
  id,
  logger,
  network,
}: IFetchAssetWithDelayOptions): Promise<IARC0200AssetInformation | null> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let contract: ARC0200Contract;
      let result: IARC0200AssetInformation;

      try {
        contract = new ARC0200Contract({
          appId: id,
          network,
          logger,
        });
        result = await contract.metadata();

        resolve(result);
      } catch (error) {
        switch (error.code) {
          case ErrorCodeEnum.InvalidABIContractError:
            return resolve(null);
          default:
            break;
        }

        reject(error);
      }
    }, delay)
  );
}
