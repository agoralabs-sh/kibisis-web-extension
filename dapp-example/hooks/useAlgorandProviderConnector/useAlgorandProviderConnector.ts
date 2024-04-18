import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  IEnableResult,
} from '@agoralabs-sh/algorand-provider';
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

  return {
    connectAction,
    disconnectAction,
    enabledAccounts,
  };
}
