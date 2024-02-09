// types
import { IBaseOptions } from '@common/types';
import {
  IARC0200AssetInformation,
  IARC0200Asset,
  INetwork,
} from '@extension/types';

// utils
import getAlgodClient from '@common/utils/getAlgodClient';
import getIndexerClient from '@common/utils/getIndexerClient';
import fetchARC0200AssetInformationWithDelay from '../fetchARC0200AssetInformationWithDelay';
import mapARC0200AssetFromARC0200AssetInformation from '../mapARC0200AssetFromARC0200AssetInformation';

interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

/**
 * Gets the ARC-0200 asset information.
 * @param {string} id - the app ID of the ARC200 asset to fetch.
 * @param {IOptions} options - options needed to fetch the ARC200 asset information.
 * @returns {Promise<IARC0200Asset | null>} the ARC-0200 asset information, or null if there was an error.
 */
export default async function updateARC0200AssetInformationById(
  id: string,
  { delay = 0, logger, network }: IOptions
): Promise<IARC0200Asset | null> {
  const _functionName: string = 'updateARC0200AssetInformationById';
  let assetInformation: IARC0200AssetInformation | null;

  try {
    assetInformation = await fetchARC0200AssetInformationWithDelay({
      algodClient: getAlgodClient(network, {
        logger,
      }),
      delay,
      id,
      indexerClient: getIndexerClient(network, {
        logger,
      }),
    });

    if (!assetInformation) {
      return null;
    }

    return mapARC0200AssetFromARC0200AssetInformation(
      id,
      assetInformation,
      null,
      false
    );
  } catch (error) {
    logger &&
      logger.error(
        `${_functionName}: failed to get arc-0200 asset information for arc-0200 asset "${id}" on ${network.genesisId}: ${error.message}`
      );

    return null;
  }
}
