import BigNumber from 'bignumber.js';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// contracts
import ARC0200Contract from '@extension/contracts/ARC0200Contract';

// types
import type { IARC0200AssetInformation } from '@extension/types';
import type { IOptions } from './types';

/**
 * Fetches ARC-0200 asset information from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IARC0200AssetInformation | null} ARC-0200 asset information or null if the asset is not an ARC-0200 asset.
 */
export default async function fetchARC0200AssetInformationWithDelay({
  delay,
  id,
  logger,
  network,
}: IOptions): Promise<IARC0200AssetInformation | null> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let contract: ARC0200Contract;
      let result: IARC0200AssetInformation;

      try {
        contract = new ARC0200Contract({
          appId: new BigNumber(id),
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
