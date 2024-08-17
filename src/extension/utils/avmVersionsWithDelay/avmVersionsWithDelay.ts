import { IntDecoding } from 'algosdk';

// types
import type { IAVMVersions } from '@extension/types';
import type { IOptions } from './types';

/**
 * Fetches algod versions with an optional delay.
 * @param {IOptions} options - the algod client and an optional delay.
 * @returns {Promise<IAVMVersions>} a promise that resolves to the versions.
 */
export default async function avmVersionsWithDelay({
  client,
  delay = 0,
}: IOptions): Promise<IAVMVersions> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      try {
        const result = (await client
          .versionsCheck()
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAVMVersions;

        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
