import { Algodv2, IntDecoding } from 'algosdk';

// types
import { IAlgorandAccountInformation } from '@extension/types';

interface IOptions {
  address: string;
  client: Algodv2;
  delay: number;
}

/**
 * Fetches account information from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IAlgorandAccountInformation} account information from the node.
 */
export default async function algorandAccountInformationWithDelay({
  address,
  client,
  delay,
}: IOptions): Promise<IAlgorandAccountInformation> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let accountInformation: IAlgorandAccountInformation;

      try {
        accountInformation = (await client
          .accountInformation(address)
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAccountInformation;

        resolve(accountInformation);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
