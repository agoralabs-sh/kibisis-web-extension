// constants
import { VESTIGE_FI_API_URL } from '@extension/constants';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IVestigeFiAssetResponse } from '@extension/types';

// utils
import fetchWithDelay from './fetchWithDelay';

interface IOptions extends IBaseOptions {
  delay?: number;
}

export default async function fetchAssetVerification(
  id: string,
  options?: IOptions
): Promise<boolean> {
  const delay: number = options?.delay || 0;
  const logger: ILogger | null = options?.logger || null;
  let parsedResponse: IVestigeFiAssetResponse;
  let response: Response;

  try {
    response = await fetchWithDelay({
      delay,
      url: `${VESTIGE_FI_API_URL}/asset/${id}`,
    });

    if (!response.ok) {
      logger &&
        logger.debug(
          `${fetchAssetVerification.name}(): unable to get verification status for asset "${id}": response from server ${response.status}`
        );

      return false;
    }

    parsedResponse = await response.json();

    return parsedResponse.verified;
  } catch (error) {
    logger &&
      logger.error(`${fetchAssetVerification.name}(): ${error.message}`);

    return false;
  }
}
