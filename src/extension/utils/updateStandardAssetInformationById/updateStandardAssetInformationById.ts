import { Algodv2 } from 'algosdk';

// types
import type {
  IAlgorandAsset,
  IStandardAsset,
  ITinyManAssetResponse,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import fetchStandardAssetInformationWithDelay from '../fetchStandardAssetInformationWithDelay';
import mapStandardAssetFromAlgorandAsset from '../mapStandardAssetFromAlgorandAsset';

/**
 * Gets the standard asset information.
 * @param {IOptions} options - options needed to fetch the standard asset information.
 * @returns {Promise<IStandardAsset | null>} the standard asset information, or null if there was an error.
 */
export default async function updateStandardAssetInformationById({
  algoNode,
  delay = 0,
  id,
  logger,
  verifiedAssetList,
}: IOptions): Promise<IStandardAsset | null> {
  const _functionName = 'updateStandardAssetInformationById';
  let assetInformation: IAlgorandAsset;
  let client: Algodv2;
  let verifiedAsset: ITinyManAssetResponse | null;

  client = createAlgodClient({
    port: algoNode.port,
    token: algoNode.token,
    url: algoNode.url,
  });

  try {
    assetInformation = await fetchStandardAssetInformationWithDelay({
      client,
      delay,
      id,
    });
    verifiedAsset = verifiedAssetList.find((value) => value.id === id) || null;

    return mapStandardAssetFromAlgorandAsset(
      assetInformation,
      verifiedAsset?.logo.svg || null,
      !!verifiedAsset
    );
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get asset information for asset "${id}" at "${
        algoNode.port ? `${algoNode.url}:${algoNode.port}` : algoNode.url
      }":`,
      error
    );

    return null;
  }
}
