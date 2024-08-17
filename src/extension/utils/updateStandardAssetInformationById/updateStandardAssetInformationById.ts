import { Algodv2 } from 'algosdk';

// types
import { IBaseOptions } from '@common/types';
import {
  IAlgorandAsset,
  IStandardAsset,
  INetwork,
  ITinyManAssetResponse,
} from '@extension/types';

// utils
import createAlgodClientFromNetwork from '@common/utils/createAlgodClientFromNetwork';
import fetchStandardAssetInformationWithDelay from '../fetchStandardAssetInformationWithDelay';
import mapStandardAssetFromAlgorandAsset from '../mapStandardAssetFromAlgorandAsset';

interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
  verifiedAssetList: ITinyManAssetResponse[];
}

/**
 * Gets the standard asset information.
 * @param {string} id - the ID of the standard asset to fetch.
 * @param {IOptions} options - options needed to fetch the standard asset information.
 * @returns {Promise<IStandardAsset | null>} the standard asset information, or null if there was an error.
 */
export default async function updateStandardAssetInformationById(
  id: string,
  { delay = 0, logger, network, verifiedAssetList }: IOptions
): Promise<IStandardAsset | null> {
  let standardAssetInformation: IAlgorandAsset;
  let client: Algodv2;
  let verifiedAsset: ITinyManAssetResponse | null;

  client = createAlgodClientFromNetwork(network);

  try {
    standardAssetInformation = await fetchStandardAssetInformationWithDelay({
      client,
      delay,
      id,
    });
    verifiedAsset = verifiedAssetList.find((value) => value.id === id) || null;

    return mapStandardAssetFromAlgorandAsset(
      standardAssetInformation,
      verifiedAsset?.logo.svg || null,
      !!verifiedAsset
    );
  } catch (error) {
    logger &&
      logger.error(
        `${updateStandardAssetInformationById.name}: failed to get asset information for asset "${id}" on ${network.genesisId}: ${error.message}`
      );

    return null;
  }
}
