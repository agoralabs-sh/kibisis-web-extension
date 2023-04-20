import { Algodv2 } from 'algosdk';

// Types
import { IBaseOptions } from '@common/types';
import {
  IAlgorandAsset,
  IAsset,
  INetwork,
  INode,
  ITinyManAssetResponse,
} from '@extension/types';

// Utils
import {
  fetchAssetList,
  fetchAssetVerification,
  mapAssetFromAlgorandAsset,
  randomNode,
} from '@extension/utils';
import fetchAssetInformationWithDelay from './fetchAssetInformationWithDelay';

interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

/**
 * Gets the asset information.
 * @param {string} id - the ID of the asset to fetch.
 * @param {IOptions} options - options needed to fetch the asset information.
 * @returns {Promise<IAsset | null>} the asset information of null if there was an error.
 */
export default async function fetchAssetInformationById(
  id: string,
  { delay = 0, logger, network }: IOptions
): Promise<IAsset | null> {
  let assetInformation: IAlgorandAsset;
  let assetList: Record<string, ITinyManAssetResponse> | null = null;
  let client: Algodv2;
  let node: INode;
  let verified: boolean;

  // TODO: asset list only exists for algorand mainnet, move this url to config?
  if (network.genesisHash === 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=') {
    assetList = await fetchAssetList({
      logger,
    });
  }

  node = randomNode(network);
  client = new Algodv2('', node.url, node.port);
  verified = false;

  try {
    assetInformation = await fetchAssetInformationWithDelay({
      client,
      delay,
      id,
    });

    logger &&
      logger.debug(
        `${fetchAssetInformationById.name}: getting verified status for "${id}" from "${node.name}" on "${network.genesisId}"`
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

    return mapAssetFromAlgorandAsset(
      assetInformation,
      assetList ? assetList[id]?.logo.svg || null : null,
      verified
    );
  } catch (error) {
    logger &&
      logger.error(
        `${fetchAssetInformationById.name}: failed to get asset information for asset "${id}" from "${node.name}" on ${network.genesisId}: ${error.message}`
      );

    return null;
  }
}
