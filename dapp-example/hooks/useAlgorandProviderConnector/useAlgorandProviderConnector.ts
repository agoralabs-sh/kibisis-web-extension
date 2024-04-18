import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  IEnableResult,
  ISignTxnsResult,
} from '@agoralabs-sh/algorand-provider';
import { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';
import { useState } from 'react';

// types
import type { INetwork } from '@extension/types';
import type { IWindow } from '@external/types';
import type {
  IAccountInformation,
  IConnectorParams,
  IConnectorState,
} from '../../types';

// utils
import { getAccountInformation } from '../../utils';

export default function useAlgorandProviderConnector({
  toast,
}: IConnectorParams): IConnectorState {
  // state
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  // actions
  const connectAction = async (network: INetwork) => {
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
    let result: IBaseResult & IEnableResult;

    if (!algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet',
        status: 'error',
        title: 'window.algorand not found!',
      });

      return;
    }

    try {
      result = await algorand.enable({
        genesisHash: network.genesisHash,
      });

      setEnabledAccounts(
        await Promise.all(
          result.accounts.map<Promise<IAccountInformation>>((account) =>
            getAccountInformation(account, network as INetwork)
          )
        )
      );

      toast({
        description: `Successfully connected via Algorand Provider.`,
        status: 'success',
        title: 'Connected!',
      });
    } catch (error) {
      toast({
        description: (error as BaseError).message,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });
    }
  };
  const disconnectAction = async () => {
    setEnabledAccounts([]);

    toast({
      description: `Successfully disconnected via Algorand Provider.`,
      status: 'success',
      title: 'Disconnected!',
    });
  };
  const signTransactionsAction = async (
    transactions: IARC0001Transaction[]
  ) => {
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
    let result: ISignTxnsResult;

    if (!algorand) {
      throw new Error('window.algorand not found');
    }

    result = await algorand.signTxns({
      txns: transactions,
    });

    return result.stxns;
  };

  return {
    connectAction,
    disconnectAction,
    enabledAccounts,
    signTransactionsAction,
  };
}
