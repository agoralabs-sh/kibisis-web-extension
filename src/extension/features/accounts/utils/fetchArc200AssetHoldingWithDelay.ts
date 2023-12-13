import { Algodv2 } from 'algosdk';
import Arc200Contract from 'arc200js';

// types
import { IArc200AssetHolding } from '@extension/types';

interface IOptions {
  address: string;
  arc200AppId: string;
  client: Algodv2;
  delay: number;
}

/**
 * Fetches ARC-200 asset holding from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IArc200AssetHolding} arc200 asset holding.
 */
export default async function fetchArc200AssetHoldingWithDelay({
  address,
  arc200AppId,
  client,
  delay,
}: IOptions): Promise<IArc200AssetHolding> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      const contract: Arc200Contract = new Arc200Contract(
        parseInt(arc200AppId),
        client,
        undefined
      );
      let amount: string = '0';
      let result: { success: boolean; returnValue: bigint };

      try {
        result = await contract.arc200_balanceOf(address);

        if (result.success) {
          amount = String(result.returnValue);
        }

        resolve({
          id: arc200AppId,
          amount,
        });
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
