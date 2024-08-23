// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type {
  IARC0072Asset,
  IARC0072AssetInformation,
  IUpdateAssetInformationByIdOptions,
} from '@extension/types';

// utils
import mapARC0072AssetFromARC0072AssetInformation from '../mapARC0072AssetFromARC0072AssetInformation';

/**
 * Gets the ARC-0072 asset information.
 * @param {IOptions} options - options needed to fetch the ARC200 asset information.
 * @returns {Promise<IARC0072Asset | null>} the ARC-0072 asset information, or null if there was an error.
 */
export default async function updateARC0072AssetInformationById({
  delay,
  id,
  logger,
  network,
  nodeID,
}: IUpdateAssetInformationByIdOptions): Promise<IARC0072Asset | null> {
  const _functionName = 'updateARC0072AssetInformationById';
  const networkClient = new NetworkClient({ logger, network });
  let assetInformation: IARC0072AssetInformation | null;

  try {
    assetInformation = await networkClient.arc0072AssetInformationWithDelay({
      delay,
      id,
      nodeID,
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
