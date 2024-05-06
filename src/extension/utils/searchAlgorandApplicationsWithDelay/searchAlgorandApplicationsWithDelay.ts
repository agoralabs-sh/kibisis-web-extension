import { IntDecoding } from 'algosdk';
import type SearchForApplications from 'algosdk/dist/types/client/v2/indexer/searchForApplications';

// types
import type { IAlgorandSearchApplicationsResult } from '@extension/types';
import type { IOptions } from './types';

/**
 * Searches for applications by the app ID from the node with a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {IAlgorandSearchApplicationsResult} applications from the node.
 */
export default async function searchAlgorandApplicationsWithDelay({
  applicationId,
  client,
  delay,
  limit,
  next,
}: IOptions): Promise<IAlgorandSearchApplicationsResult> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let result: IAlgorandSearchApplicationsResult;
      let requestBuilder: SearchForApplications;

      try {
        requestBuilder = client
          .searchForApplications()
          .index(parseInt(applicationId))
          .limit(limit);

        if (next) {
          requestBuilder.nextToken(next);
        }

        result = (await requestBuilder
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandSearchApplicationsResult;

        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
