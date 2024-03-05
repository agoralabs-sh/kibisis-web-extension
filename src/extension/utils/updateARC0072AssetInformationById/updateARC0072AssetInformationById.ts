// types
import type {
  IARC0072Asset,
  IARC0072AssetInformation,
  IUpdateAssetInformationByIdOptions,
} from '@extension/types';

// utils
import fetchARC0072AssetInformationWithDelay from '../fetchARC0072AssetInformationWithDelay';
import mapARC0072AssetFromARC0072AssetInformation from '../mapARC0072AssetFromARC0072AssetInformation';

/**
 * Gets the ARC-0072 asset information.
 * @param {string} id - the app ID of the ARC-0072 asset to fetch.
 * @param {IOptions} options - options needed to fetch the ARC200 asset information.
 * @returns {Promise<IARC0072Asset | null>} the ARC-0072 asset information, or null if there was an error.
 */
export default async function updateARC0072AssetInformationById(
  id: string,
  { delay = 0, logger, network }: IUpdateAssetInformationByIdOptions
): Promise<IARC0072Asset | null> {
  const _functionName: string = 'updateARC0072AssetInformationById';
  let assetInformation: IARC0072AssetInformation | null;

  try {
    assetInformation = await fetchARC0072AssetInformationWithDelay({
      delay,
      id,
      logger,
      network,
    });

    if (!assetInformation) {
      return null;
    }

    return mapARC0072AssetFromARC0072AssetInformation(
      id,
      assetInformation,
      false
    );
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get arc-0072 asset information for arc-0072 asset "${id}" on ${network.genesisId}: ${error.message}`
    );

    return null;
  }
}
