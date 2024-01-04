// constants
import { VESTIGE_FI_API_URL } from '@extension/constants';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { INetwork, IVestigeFiAssetResponse } from '@extension/types';

// utils
import fetchWithDelay from '../fetchWithDelay';

/**
 * @property {number} delay - [optional] the number of milliseconds to delay the fetch request. Defaults to 0.
 * @property {INetwork} network - the network to use.
 */
interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

/**
 * Uses Vestige.fi's verification API to check the verification status of a particular asset.
 * Only allows Algorand mainnet assets, all other network assets will return false.
 * @param {string} id - the ID of the asset.
 * @param {IOptions} options - options necessary to get the verified status.
 * @returns {Promise<boolean>} true if the asset has been verified, false otherwise.
 */
export default async function fetchAssetVerification(
  id: string,
  { delay = 0, logger, network }: IOptions
): Promise<boolean> {
  let parsedResponse: IVestigeFiAssetResponse;
  let response: Response;

  logger &&
    logger.debug(
      `${fetchAssetVerification.name}: getting verified status for "${id}" on "${network.genesisId}"`
    );

  // vestige only verifies mainnet
  // TODO: use custom service?
  if (network.genesisHash !== 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=') {
    logger &&
      logger.debug(
        `${fetchAssetVerification.name}(): asset "${id}" not on mainnet, skipping`
      );

    return false;
  }

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
