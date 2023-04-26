import { Algodv2 } from 'algosdk';

// Constants
import { ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT } from '@extension/constants';

// Types
import { IBaseOptions } from '@common/types';
import {
  IAccount,
  IAlgorandAccountInformation,
  INetwork,
  INode,
} from '@extension/types';

// Utils
import { randomNode } from '@common/utils';
import { mapAlgorandAccountInformationToAccount } from '@extension/utils';
import fetchAccountInformationWithDelay from './fetchAccountInformationWithDelay';

interface IOptions extends IBaseOptions {
  delay?: number;
  network: INetwork;
}

/**
 * Updates the account information for the supplied account.
 * @param {IAccount} account - the account to update.
 * @param {IOptions} options - options needed to update the accounts.
 * @returns {Promise<IAccount>} the updated accounts.
 */
export default async function updateAccountInformation(
  account: IAccount,
  { delay = 0, logger, network }: IOptions
): Promise<IAccount> {
  const timestamp: number = new Date().getTime();
  let accountInformation: IAlgorandAccountInformation;
  let client: Algodv2;
  let node: INode;
  let updatedAt: Date;

  if (!network) {
    logger &&
      logger.debug(
        `${updateAccountInformation.name}(): unrecognized network "${account.genesisHash}" for "${account.id}", skipping`
      );

    return account;
  }

  // if the account information is not out-of-date just return the account
  if (
    account.updatedAt &&
    account.updatedAt + ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT > timestamp
  ) {
    logger &&
      logger.debug(
        `${updateAccountInformation.name}: last updated "${new Date(
          account.updatedAt
        ).toString()}", skipping`
      );

    return account;
  }

  node = randomNode(network);
  client = new Algodv2('', node.url, node.port);

  logger &&
    logger.debug(
      `${updateAccountInformation.name}: fetching account information for "${account.address}" from "${node.name}" on "${network.genesisId}"`
    );

  try {
    accountInformation = await fetchAccountInformationWithDelay({
      address: account.address,
      client,
      delay,
    });
    updatedAt = new Date();

    logger &&
      logger.debug(
        `${
          updateAccountInformation.name
        }: successfully updated account information for "${
          account.address
        }" from "${node.name}" on "${
          network.genesisId
        }" at "${updatedAt.toString()}"`
      );

    return mapAlgorandAccountInformationToAccount(
      accountInformation,
      account,
      updatedAt.getTime()
    );
  } catch (error) {
    logger &&
      logger.error(
        `${updateAccountInformation.name}: failed to get account information for "${account.address}" from "${node.name}" on ${network.genesisId}: ${error.message}`
      );

    return account;
  }
}
