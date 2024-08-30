import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  IEnableResult,
  ISignBytesResult,
  ISignTxnsResult,
} from '@agoralabs-sh/algorand-provider';
import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';
import { encode as encodeBase64 } from '@stablelib/base64';
import { useState } from 'react';

// types
import type { INetwork } from '@extension/types';
import type { IWindow } from '@external/types';
import type {
  IAccountInformation,
  IConnectorParams,
  IConnectorState,
  ISignMessageActionResult,
} from '../../types';

// utils
import { getAccountInformation } from '../../utils';

export default function useAlgorandProviderConnector({
  toast,
}: IConnectorParams): IConnectorState {
  const _hookName = 'useAVMWebProviderConnector';
  // states
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  // actions
  const connectAction = async (network: INetwork) => {
    const _functionName = 'connectAction';
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
    let result: IBaseResult & IEnableResult;

    if (!algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet',
        status: 'error',
        title: 'window.algorand not found!',
      });

      return false;
    }

    try {
      result = await algorand.enable({
        genesisHash: network.genesisHash,
      });
    } catch (error) {
      console.error(`${_hookName}#${_functionName}:`, error);

      toast({
        description: (error as BaseError).message,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });

      return false;
    }

    try {
      setEnabledAccounts(
        await Promise.all(
          result.accounts.map<Promise<IAccountInformation>>((account) =>
            getAccountInformation(account, network as INetwork)
          )
        )
      );
    } catch (error) {
      console.error(`${_hookName}#${_functionName}:`, error);

      toast({
        status: 'error',
        title: 'Failed to get account information for connected wallets',
      });

      return false;
    }

    toast({
      description: `Successfully connected via Algorand Provider.`,
      status: 'success',
      title: 'Connected!',
    });

    return true;
  };
  const disconnectAction = async () => {
    setEnabledAccounts([]);

    toast({
      description: `Successfully disconnected via Algorand Provider.`,
      status: 'success',
      title: 'Disconnected!',
    });
  };
  const signMessageAction = async (
    message: string,
    signer?: string
  ): Promise<ISignMessageActionResult> => {
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
    let result: IBaseResult & ISignBytesResult;

    if (!algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet',
        status: 'error',
        title: 'window.algorand not found!',
      });

      throw new Error('window.algorand not found');
    }

    if (!signer) {
      toast({
        description: 'Algorand Provider requires a signer',
        status: 'error',
        title: 'No Signer Ser!',
      });

      throw new Error('a signer is required');
    }

    result = await algorand.signBytes({
      data: new TextEncoder().encode(message),
      signer,
    });

    return {
      signature: encodeBase64(result.signature),
      signer,
    };
  };
  const signTransactionsAction = async (
    transactions: IARC0001Transaction[]
  ) => {
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
    let result: IBaseResult & ISignTxnsResult;

    if (!algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet',
        status: 'error',
        title: 'window.algorand not found!',
      });

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
    signMessageAction,
    signTransactionsAction,
  };
}
