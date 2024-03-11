import { Indexer, IntDecoding } from 'algosdk';
import SearchForApplications from 'algosdk/dist/types/client/v2/indexer/searchForApplications';

// types
import { IAlgorandSearchApplicationsResult } from '@extension/types';

interface IOptions {
  applicationId: string;
  client: Indexer;
  delay: number;
  limit: number;
  next: string | null;
}

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
