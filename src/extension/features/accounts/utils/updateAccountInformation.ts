import { Algodv2 } from 'algosdk';

// constants
import { ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT } from '@extension/constants';

// services
import { AccountService } from '@extension/services';

// types
import { IBaseOptions } from '@common/types';
import {
  IAccount,
  IAccountInformation,
  IAlgorandAccountInformation,
  INetwork,
} from '@extension/types';

// utils
import { getAlgodClient } from '@common/utils';
import {
  convertGenesisHashToHex,
  mapAlgorandAccountInformationToAccount,
} from '@extension/utils';
import fetchAlgorandAccountInformationWithDelay from './fetchAlgorandAccountInformationWithDelay';

interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

/**
 * Fetches the account information for a given address.
 * @param {IAccount} account - the account.
 * @param {IOptions} options - options needed to update the account information.
 * @returns {Promise<IAccountInformation>} the updated account information.
 */
export default async function updateAccountInformation(
  account: IAccount,
  { delay = 0, logger, network }: IOptions
): Promise<IAccountInformation> {
  const encodedGenesisHash: string = convertGenesisHashToHex(
    network.genesisHash
  );
  const accountInformation: IAccountInformation =
    account.networkInformation[encodedGenesisHash] ||
    AccountService.initializeDefaultAccountInformation();
  let address: string;
  let algorandAccountInformation: IAlgorandAccountInformation;
  let client: Algodv2;
  let updatedAt: Date;

  // if the account information is not out-of-date just return the account
  if (
    accountInformation.updatedAt &&
    accountInformation.updatedAt + ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT >
      new Date().getTime()
  ) {
    logger &&
      logger.debug(
        `${updateAccountInformation.name}: last updated "${new Date(
          accountInformation.updatedAt
        ).toString()}", skipping`
      );

    return accountInformation;
  }

  address = AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  client = getAlgodClient(network, {
    logger,
  });

  logger &&
    logger.debug(
      `${updateAccountInformation.name}: fetching account information for "${address}" on "${network.genesisId}"`
    );

  try {
    algorandAccountInformation = await fetchAlgorandAccountInformationWithDelay(
      {
        address,
        client,
        delay,
      }
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
      accountInformation,
      updatedAt.getTime()
    );
  } catch (error) {
    logger &&
      logger.error(
        `${updateAccountInformation.name}: failed to get account information for "${address}" on ${network.genesisId}: ${error.message}`
      );

    return accountInformation;
  }
}
