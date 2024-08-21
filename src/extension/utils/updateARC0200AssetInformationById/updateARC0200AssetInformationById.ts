// types
import type {
  IARC0200AssetInformation,
  IARC0200Asset,
  IUpdateAssetInformationByIdOptions,
} from '@extension/types';

// utils
import fetchARC0200AssetInformationWithDelay from '../fetchARC0200AssetInformationWithDelay';
import mapARC0200AssetFromARC0200AssetInformation from '../mapARC0200AssetFromARC0200AssetInformation';

/**
 * Gets the ARC-0200 asset information.
 * @param {IOptions} options - options needed to fetch the ARC200 asset information.
 * @returns {Promise<IARC0200Asset | null>} the ARC-0200 asset information, or null if there was an error.
 */
export default async function updateARC0200AssetInformationById({
  customNodeOrNetwork,
  delay = 0,
  id,
  logger,
}: IUpdateAssetInformationByIdOptions): Promise<IARC0200Asset | null> {
  const _functionName: string = 'updateARC0200AssetInformationById';
  let assetInformation: IARC0200AssetInformation | null;

  try {
    assetInformation = await fetchARC0200AssetInformationWithDelay({
      delay,
      id,
      logger,
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
    logger?.error(
      `${_functionName}: failed to get arc-0200 asset information for arc-0200 asset "${id}" on ${network.genesisId}: ${error.message}`
    );

    return null;
  }
}
