// constants
import { TINYMAN_ASA_LIST_API_URL } from '@extension/constants';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { ITinyManAssetResponse } from '@extension/types';

export default async function fetchAssetList(
  options?: IBaseOptions
): Promise<Record<string, ITinyManAssetResponse> | null> {
  const logger: ILogger | null = options?.logger || null;
  let response: Response;

  try {
    response = await fetch(`${TINYMAN_ASA_LIST_API_URL}/assets.json`);

    if (!response.ok) {
      logger &&
        logger.debug(
          `${fetchAssetList.name}(): unable to get asset list from tinyman: response from server ${response.status}`
        );

      return null;
    }

    return await response.json();
  } catch (error) {
    logger && logger.error(`${fetchAssetList.name}(): ${error.message}`);

    return null;
  }
}
