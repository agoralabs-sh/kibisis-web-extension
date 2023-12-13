import { Algodv2 } from 'algosdk';

// types
import { IBaseOptions } from '@common/types';
import {
  IArc200AssetInformation,
  IArc200Asset,
  INetwork,
} from '@extension/types';

// utils
import { getAlgodClient } from '@common/utils';
import { mapArc200AssetFromArc200AssetInformation } from '@extension/utils';
import fetchArc200AssetInformationWithDelay from './fetchArc200AssetInformationWithDelay';

interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

/**
 * Gets the ARC200 asset information.
 * @param {string} id - the app ID of the ARC200 asset to fetch.
 * @param {IOptions} options - options needed to fetch the ARC200 asset information.
 * @returns {Promise<IArc200Asset | null>} the ARC200 asset information, or null if there was an error.
 */
export default async function updateArc200AssetInformationById(
  id: string,
  { delay = 0, logger, network }: IOptions
): Promise<IArc200Asset | null> {
  const client: Algodv2 = getAlgodClient(network, {
    logger,
  });
  let assetInformation: IArc200AssetInformation | null;

  try {
    assetInformation = await fetchArc200AssetInformationWithDelay({
      client,
      delay,
      id,
    });

    if (!assetInformation) {
      return null;
    }

    return mapArc200AssetFromArc200AssetInformation(
      id,
      assetInformation,
      null,
      false
    );
  } catch (error) {
    logger &&
      logger.error(
        `${updateArc200AssetInformationById.name}: failed to get arc200 asset information for arc200 asset "${id}" on ${network.genesisId}: ${error.message}`
      );

    return null;
  }
}
