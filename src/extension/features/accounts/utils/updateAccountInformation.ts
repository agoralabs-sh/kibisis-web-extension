import { Algodv2 } from 'algosdk';

// Constants
import {
  ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT,
  NODE_REQUEST_DELAY,
  ACCOUNT_KEY_PREFIX,
} from '@extension/constants';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAlgorandAccountInformation,
  INetwork,
  INode,
} from '@extension/types';

// Utils
import {
  mapAlgorandAccountInformationToAccount,
  randomNode,
} from '@extension/utils';
import fetchAccountInformationWithDelay from './fetchAccountInformationWithDelay';

interface IOptions {
  logger: ILogger;
  networks: INetwork[];
}

/**
 * Updates the account information for all the supplied accounts.
 * @param {IAccount[]} accounts - the accounts to update.
 * @param {IOptions} options - options needed to update the accounts.
 * @returns {Promise<IAccount[]>} the updated accounts.
 */
export default async function updateAccountInformation(
  accounts: IAccount[],
  { logger, networks }: IOptions
): Promise<IAccount[]> {
  const storageManager: StorageManager = new StorageManager();
  const updatedAccounts: IAccount[] = await Promise.all(
    accounts.map(async (account, index) => {
      const network: INetwork | null =
        networks.find((value) => value.genesisHash === account.genesisHash) ||
        null;
      const timestamp: number = new Date().getTime();
      let accountInformation: IAlgorandAccountInformation;
      let client: Algodv2;
      let node: INode;
      let updatedAt: Date;

      if (!network) {
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
        logger.debug(
          `${updateAccountInformation.name}: last updated "${new Date(
            account.updatedAt
          ).toString()}", skipping`
        );

        return account;
      }

      node = randomNode(network);
      client = new Algodv2('', node.url, node.port);

      logger.debug(
        `${updateAccountInformation.name}: fetching account information for "${account.address}" from "${node.name}" on "${network.genesisId}"`
      );

      try {
        accountInformation = await fetchAccountInformationWithDelay({
          address: account.address,
          client,
          delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
        });
        updatedAt = new Date();

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
        logger.error(
          `${updateAccountInformation.name}: failed to get account information for "${account.address}" from "${node.name}" on ${network.genesisId}: ${error.message}`
        );

        return account;
      }
    })
  );

  // update the storage with the latest account information
  await storageManager.setItems(
    updatedAccounts.reduce(
      (acc, value) => ({
        ...acc,
        [`${ACCOUNT_KEY_PREFIX}${value.id}`]: value,
      }),
      {}
    )
  );

  return updatedAccounts;
}
