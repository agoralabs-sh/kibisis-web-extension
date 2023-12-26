// constants
import { TINYMAN_ASA_LIST_API_URL } from '@extension/constants';

// types
import { IBaseOptions } from '@common/types';
import { INetwork, ITinyManAssetResponse } from '@extension/types';

interface IOptions extends IBaseOptions {
  network: INetwork;
}

/**
 * Gets Tinyman's asset list. Any asset on this list can be considered "verified".
 *
 * Only works on Algorand mainnet assets, all other network will return an empty array.
 * @param {IOptions} options - various options to customize the request.
 * @returns {Promise<ITinyManAssetResponse>} the Tinyman asset list.
 */
export default async function fetchVerifiedStandardAssetList({
  logger,
  network,
}: IOptions): Promise<ITinyManAssetResponse[]> {
  let response: Response;
  let jsonResponse: Record<string, ITinyManAssetResponse>;

  // TODO: use network config to determine this
  if (network.genesisHash !== 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=') {
    logger &&
      logger.debug(
        `${fetchVerifiedStandardAssetList.name}(): no asset list defined, skipping`
      );

    return [];
  }

  logger &&
    logger.debug(
      `${fetchVerifiedStandardAssetList.name}(): getting tinyman asset list for network "${network.genesisId}"`
    );

  try {
    response = await fetch(`${TINYMAN_ASA_LIST_API_URL}/assets.json`);

    if (!response.ok) {
      logger &&
        logger.debug(
          `${fetchVerifiedStandardAssetList.name}(): unable to get asset list from tinyman: response from server ${response.status}`
        );

      return [];
    }

    jsonResponse = await response.json();

    return Object.keys(jsonResponse).map((key) => jsonResponse[key]);
  } catch (error) {
    logger &&
      logger.error(
        `${fetchVerifiedStandardAssetList.name}(): ${error.message}`
      );

    return [];
  }
}
