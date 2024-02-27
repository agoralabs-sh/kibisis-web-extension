import { Algodv2 } from 'algosdk';

// constants
import { ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT } from '@extension/constants';

// types
import type {
  IAccountInformation,
  IAlgorandAccountInformation,
  IARC0200AssetHolding,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import fetchARC0200AssetHoldingWithDelay from '@extension/utils/fetchARC0200AssetHoldingWithDelay';
import algorandAccountInformationWithDelay from '@extension/utils/algorandAccountInformationWithDelay';
import mapAlgorandAccountInformationToAccount from '@extension/utils/mapAlgorandAccountInformationToAccount';

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
  const _functionName: string = 'updateAccountInformation';
  let algorandAccountInformation: IAlgorandAccountInformation;
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

  client = createAlgodClient(network, {
    logger,
  });

  logger?.debug(
    `${_functionName}: updating account information for "${address}" on "${network.genesisId}"`
  );

  try {
    algorandAccountInformation = await algorandAccountInformationWithDelay({
      address,
      client,
      delay,
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

    logger?.debug(
      `${_functionName}: successfully updated account information for "${address}" on "${
        network.genesisId
      }" at "${updatedAt.toString()}"`
    );

    return mapAlgorandAccountInformationToAccount(
      algorandAccountInformation,
      {
        ...currentAccountInformation,
        arc200AssetHoldings,
      },
      updatedAt.getTime()
    );
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get account information for "${address}" on ${network.genesisId}: ${error.message}`
    );

    return currentAccountInformation;
  }
}
