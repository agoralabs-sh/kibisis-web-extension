import { Algodv2 } from 'algosdk';

// constants
import { ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT } from '@extension/constants';

// types
import { IBaseOptions } from '@common/types';
import {
  IAccountInformation,
  IAlgorandAccountInformation,
  IArc200AssetHolding,
  INetwork,
} from '@extension/types';

// utils
import getAlgodClient from '@common/utils/getAlgodClient';
import algorandAccountInformationWithDelay from '@extension/utils/algorandAccountInformationWithDelay';
import mapAlgorandAccountInformationToAccount from '@extension/utils/mapAlgorandAccountInformationToAccount';
import fetchArc200AssetHoldingWithDelay from './fetchArc200AssetHoldingWithDelay';

interface IOptions extends IBaseOptions {
  address: string;
  currentAccountInformation: IAccountInformation;
  delay?: number;
  forceUpdate?: boolean;
  network: INetwork;
}

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
  let algorandAccountInformation: IAlgorandAccountInformation;
  let arc200AssetHoldings: IArc200AssetHolding[];
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
    logger &&
      logger.debug(
        `${updateAccountInformation.name}: last updated "${new Date(
          currentAccountInformation.updatedAt
        ).toString()}", skipping`
      );

    return currentAccountInformation;
  }

  client = getAlgodClient(network, {
    logger,
  });

  logger &&
    logger.debug(
      `${updateAccountInformation.name}: updating account information for "${address}" on "${network.genesisId}"`
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
          await fetchArc200AssetHoldingWithDelay({
            address,
            arc200AppId: value.id,
            client,
            delay,
          })
      )
    );
    updatedAt = new Date();

    logger &&
      logger.debug(
        `${
          updateAccountInformation.name
        }: successfully updated account information for "${address}" on "${
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
    logger &&
      logger.error(
        `${updateAccountInformation.name}: failed to get account information for "${address}" on ${network.genesisId}: ${error.message}`
      );

    return currentAccountInformation;
  }
}
