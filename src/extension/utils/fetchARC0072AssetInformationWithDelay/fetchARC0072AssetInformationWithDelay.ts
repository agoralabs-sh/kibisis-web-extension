import BigNumber from 'bignumber.js';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// contracts
import ARC0072Contract from '@extension/contracts/ARC0072Contract';

// types
import type {
  IARC0072AssetInformation,
  IFetchAssetWithDelayOptions,
} from '@extension/types';

/**
 * Fetches ARC-0072 asset information from the node with a delay.
 * @param {IFetchAssetWithDelayOptions} options - options needed to send the request.
 * @returns {IARC0072AssetInformation | null} ARC-0072 asset information or null if the asset is not an ARC-0072 asset.
 */
export default async function fetchARC0072AssetInformationWithDelay({
  delay,
  id,
  logger,
  network,
}: IFetchAssetWithDelayOptions): Promise<IARC0072AssetInformation | null> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let contract: ARC0072Contract;
      let totalSupply: BigNumber;

      try {
        contract = new ARC0072Contract({
          appId: id,
          network,
          logger,
        });
        totalSupply = await contract.totalSupply();

        resolve({
          totalSupply: BigInt(totalSupply.toString()),
        });
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
