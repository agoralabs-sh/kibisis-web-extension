import BigNumber from 'bignumber.js';

// contracts
import ARC0200Contract from '@extension/contracts/ARC0200Contract';

// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import type { IARC0200AssetHolding } from '@extension/types';
import type { IOptions } from './types';

/**
 * Fetches ARC-0200 asset holding from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IARC0200AssetHolding} the ARC-0200 asset holding.
 */
export default async function fetchARC0200AssetHoldingWithDelay({
  address,
  appId,
  delay,
  logger,
  network,
}: IOptions): Promise<IARC0200AssetHolding> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      const contract: ARC0200Contract = new ARC0200Contract({
        appId: new BigNumber(appId),
        logger,
        network,
      });
      let result: BigNumber;

      try {
        result = await contract.balanceOf(address);

        resolve({
          id: appId,
          amount: result.toString(),
          type: AssetTypeEnum.ARC0200,
        });
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
