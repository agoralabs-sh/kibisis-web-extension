import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { decode as decodeHex } from '@stablelib/hex';
import { Algodv2, encodeAddress, IntDecoding } from 'algosdk';
import { BigNumber } from 'bignumber.js';
import browser from 'webextension-polyfill';

// Enums
import { AccountsThunkEnum } from '../../../enums';

// Services
import { PrivateKeyService } from '../../../services/extension';

// Types
import {
  IAccount,
  IAlgorandAccountInformation,
  ILogger,
  IMainRootState,
  INetwork,
  INode,
  IPksAccountStorageItem,
} from '../../../types';
import { IFetchAccountsOptions } from '../types';

// Utils
import { selectDefaultNetwork } from '../../../utils';

const fetchAccounts: AsyncThunk<
  IAccount[], // return
  IFetchAccountsOptions | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IFetchAccountsOptions | undefined,
  { state: IMainRootState }
>(AccountsThunkEnum.FetchAccounts, async (options, { getState }) => {
  const functionName: string = 'fetchAccounts';
  const logger: ILogger = getState().application.logger;
  const networks: INetwork[] = getState().networks.items;
  const selectedNetwork: INetwork =
    getState().settings.network || selectDefaultNetwork(networks);
  const node: INode =
    selectedNetwork.nodes[
      Math.floor(Math.random() * selectedNetwork.nodes.length)
    ]; // get random node
  const privateKeyService: PrivateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });
  const accounts: IPksAccountStorageItem[] =
    await privateKeyService.getAccounts();
  const client: Algodv2 = new Algodv2('', node.url, node.port);

  // if we are only fetching from storage just return the default values
  if (options && options.onlyFetchFromStorage) {
    logger.debug(`${functionName}(): only fetching accounts from storage`);

    return accounts.map<IAccount>((value) => ({
      address: encodeAddress(decodeHex(value.publicKey)), // the public key is stored as hexadecimal
      atomicBalance: 'N/A',
      authAddress: null,
      id: value.id,
      minAtomicBalance: 'N/A',
      name: value.name,
    }));
  }

  return await Promise.all(
    accounts.map(async (value) => {
      const address: string = encodeAddress(decodeHex(value.publicKey));
      let accountInformation: IAlgorandAccountInformation;

      try {
        logger.debug(
          `${functionName}(): fetching account information for "${address}" from "${node.name}" on "${selectedNetwork.genesisId}"`
        );

        accountInformation = (await client
          .accountInformation(address)
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAccountInformation;

        logger.debug(
          `${functionName}(): successfully fetched account information for "${address}" from "${node.name}" on "${selectedNetwork.genesisId}"`
        );

        return {
          address,
          atomicBalance: new BigNumber(
            String(accountInformation.amount as bigint)
          ).toString(),
          authAddress: accountInformation['auth-addr'] || null,
          id: value.id,
          minAtomicBalance: new BigNumber(
            String(accountInformation['min-balance'] as bigint)
          ).toString(),
          name: value.name,
        };
      } catch (error) {
        logger.error(
          `${functionName}(): failed to get account information for "${address}" from "${node.name}" on ${selectedNetwork.genesisId}: ${error.message}`
        );

        return {
          address,
          atomicBalance: 'N/A',
          authAddress: null,
          id: value.id,
          minAtomicBalance: 'N/A',
          name: value.name,
        };
      }
    })
  );
});

export default fetchAccounts;
