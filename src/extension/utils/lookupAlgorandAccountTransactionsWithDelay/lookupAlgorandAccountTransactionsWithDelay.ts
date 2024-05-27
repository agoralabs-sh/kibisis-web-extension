import { IntDecoding } from 'algosdk';
import LookupAccountTransactions from 'algosdk/dist/types/client/v2/indexer/lookupAccountTransactions';

// types
import type { IAlgorandAccountTransaction } from '@extension/types';
import type { IOptions } from './types';

/**
 * Looks up the account transactions for a given address with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IAlgorandAccountTransaction} account transactions from the node.
 */
export default async function lookupAlgorandAccountTransactionsWithDelay({
  address,
  afterTime,
  client,
  delay,
  limit,
  next,
}: IOptions): Promise<IAlgorandAccountTransaction> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let algorandAccountTransactions: IAlgorandAccountTransaction;
      let requestBuilder: LookupAccountTransactions;

      try {
        requestBuilder = client.lookupAccountTransactions(address).limit(limit);

        if (afterTime) {
          requestBuilder.afterTime(new Date(afterTime).toISOString());
        }

        if (next) {
          requestBuilder.nextToken(next);
        }

        algorandAccountTransactions = (await requestBuilder
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAccountTransaction;

        resolve(algorandAccountTransactions);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
