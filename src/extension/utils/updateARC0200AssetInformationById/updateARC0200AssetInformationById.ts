// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type {
  IARC0200AssetInformation,
  IARC0200Asset,
  IUpdateAssetInformationByIdOptions,
} from '@extension/types';

// utils
import mapARC0200AssetFromARC0200AssetInformation from '../mapARC0200AssetFromARC0200AssetInformation';

/**
 * Gets the ARC-0200 asset information.
 * @param {IOptions} options - options needed to fetch the ARC200 asset information.
 * @returns {Promise<IARC0200Asset | null>} the ARC-0200 asset information, or null if there was an error.
 */
export default async function updateARC0200AssetInformationById({
  delay = 0,
  id,
  logger,
  network,
  nodeID,
}: IUpdateAssetInformationByIdOptions): Promise<IARC0200Asset | null> {
  const _functionName = 'updateARC0200AssetInformationById';
  const networkClient = new NetworkClient({ logger, network });
  let assetInformation: IARC0200AssetInformation | null;

  try {
    assetInformation = await networkClient.arc0200AssetInformationWithDelay({
      delay,
      id,
      nodeID,
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
