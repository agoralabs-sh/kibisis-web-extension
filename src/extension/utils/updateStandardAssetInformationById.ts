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
import { getAlgodClient } from '@common/utils';
import fetchAssetList from './fetchAssetList';
import fetchAssetVerification from './fetchAssetVerification';
import fetchStandardAssetInformationWithDelay from './fetchStandardAssetInformationWithDelay';
import mapStandardAssetFromAlgorandAsset from './mapStandardAssetFromAlgorandAsset';

interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

/**
 * Gets the standard asset information.
 * @param {string} id - the ID of the standard asset to fetch.
 * @param {IOptions} options - options needed to fetch the standard asset information.
 * @returns {Promise<IStandardAsset | null>} the standard asset information, or null if there was an error.
 */
export default async function updateStandardAssetInformationById(
  id: string,
  { delay = 0, logger, network }: IOptions
): Promise<IStandardAsset | null> {
  let standardAssetInformation: IAlgorandAsset;
  let standardAssetList: Record<string, ITinyManAssetResponse> | null = null;
  let client: Algodv2;
  let verified: boolean;

  // TODO: asset list only exists for algorand mainnet, move this url to config?
  if (network.genesisHash === 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=') {
    standardAssetList = await fetchAssetList({
      logger,
    });
  }

  client = getAlgodClient(network, {
    logger,
  });
  verified = false;

  try {
    standardAssetInformation = await fetchStandardAssetInformationWithDelay({
      client,
      delay,
      id,
    });

    logger &&
      logger.debug(
        `${updateStandardAssetInformationById.name}: getting verified status for "${id}" on "${network.genesisId}"`
      );

    // TODO: asset list only exists for algorand mainnet, move this url to config?
    if (
      network.genesisHash === 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8='
    ) {
      verified = await fetchAssetVerification(id, {
        delay,
        logger,
      });
    }

    return mapStandardAssetFromAlgorandAsset(
      standardAssetInformation,
      standardAssetList ? standardAssetList[id]?.logo.svg || null : null,
      verified
    );
  } catch (error) {
    logger &&
      logger.error(
        `${updateStandardAssetInformationById.name}: failed to get asset information for asset "${id}" on ${network.genesisId}: ${error.message}`
      );

    return null;
  }
}
