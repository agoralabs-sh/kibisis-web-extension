import { Algodv2 } from 'algosdk';

// constants
import { ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT } from '@extension/constants';

// types
import type {
  IAccountInformation,
  IAlgorandAccountInformation,
  IARC0072AssetHolding,
  IARC0200AssetHolding,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import algorandAccountInformationWithDelay from '../algorandAccountInformationWithDelay';
import fetchARC0072AssetHoldingsWithDelay from '../fetchARC0072AssetHoldingsWithDelay';
import fetchARC0200AssetHoldingWithDelay from '../fetchARC0200AssetHoldingWithDelay';
import mapAlgorandAccountInformationToAccount from '../mapAlgorandAccountInformationToAccount';

/**
 * Fetches the account information for a given address.
 * @param {IOptions} options - options needed to update the account information.
 * @returns {Promise<IAccountInformation>} the updated account information.
 */
export default async function updateAccountInformation({
  address,
  currentAccountInformation,
  delay = 0,
  forceUpdate = false,
  logger,
  network,
}: IOptions): Promise<IAccountInformation> {
  const _functionName = 'updateAccountInformation';
  let algorandAccountInformation: IAlgorandAccountInformation;
  let arc0072AssetHoldings: IARC0072AssetHolding[];
  let arc200AssetHoldings: IARC0200AssetHolding[];
  let client: Algodv2;
  let updatedAt: Date;

  // if the account information is not out-of-date just return the account
  if (
    !forceUpdate &&
    currentAccountInformation.updatedAt &&
    currentAccountInformation.updatedAt +
      ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT >
      new Date().getTime()
  ) {
    logger?.debug(
      `${_functionName}: last updated "${new Date(
        currentAccountInformation.updatedAt
      ).toString()}", skipping`
    );

    return currentAccountInformation;
  }

  client = createAlgodClient(network);

  try {
    algorandAccountInformation = await algorandAccountInformationWithDelay({
      address,
      client,
      delay,
    });
    arc0072AssetHoldings = await fetchARC0072AssetHoldingsWithDelay({
      address,
      delay,
      logger,
      network,
    });
    arc200AssetHoldings = await Promise.all(
      currentAccountInformation.arc200AssetHoldings.map(
        async (value) =>
          await fetchARC0200AssetHoldingWithDelay({
            address,
            appId: value.id,
            delay,
            logger,
            network,
          })
      )
    );
    updatedAt = new Date();

    return mapAlgorandAccountInformationToAccount(
      algorandAccountInformation,
      {
        ...currentAccountInformation,
        arc0072AssetHoldings,
        arc200AssetHoldings,
      },
      updatedAt.getTime()
    );
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get account information for "${address}" on ${network.genesisId}:`,
      error
    );

    return currentAccountInformation;
  }
}
