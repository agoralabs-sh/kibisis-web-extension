import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Algodv2, IntDecoding } from 'algosdk';
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
  IPksAccountStorageItem,
} from '../../../types';

const fetchAccounts: AsyncThunk<
  IAccount[], // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<IAccount[], undefined, { state: IMainRootState }>(
  AccountsThunkEnum.FetchAccounts,
  async (_, { getState }) => {
    const functionName: string = 'fetchAccounts';
    const logger: ILogger = getState().application.logger;
    const privateKeyService: PrivateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    const accounts: IPksAccountStorageItem[] =
      await privateKeyService.getAccounts();
    const client: Algodv2 = new Algodv2( // TODO: use node based on network selection
      '',
      'https://node.testnet.algoexplorerapi.io',
      ''
    );

    return await Promise.all(
      accounts.map(async (value) => {
        let accountInformation: IAlgorandAccountInformation;

        try {
          logger.debug(
            `${functionName}(): fetching account information for "${value.publicKey}"`
          );

          accountInformation = (await client
            .accountInformation(value.publicKey)
            .setIntDecoding(IntDecoding.BIGINT)
            .do()) as IAlgorandAccountInformation;

          return {
            address: value.publicKey,
            atomicBalance: new BigNumber(
              String(accountInformation.amount as bigint)
            ).toString(),
            authAddress: accountInformation['auth-addr'] || null,
            minAtomicBalance: new BigNumber(
              String(accountInformation['min-balance'] as bigint)
            ).toString(),
            name: value.name,
          };
        } catch (error) {
          logger.error(
            `${functionName}(): failed to get account information for "${value.publicKey}": ${error.message}`
          );

          return {
            address: value.publicKey,
            atomicBalance: 'N/A',
            authAddress: null,
            minAtomicBalance: 'N/A',
            name: value.name,
          };
        }
      })
    );
  }
);

export default fetchAccounts;
