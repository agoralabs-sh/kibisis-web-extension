import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import {
  Provider,
  PROVIDER_ID,
  useWallet as useUseWallet,
} from '@txnlab/use-wallet';
import { useEffect, useState } from 'react';

// types
import type { INetwork } from '@extension/types';
import type {
  IAccountInformation,
  IConnectorParams,
  IConnectorState,
} from '../../types';

// utils
import { getAccountInformation } from '../../utils';

export default function useUseWalletConnector({
  toast,
}: IConnectorParams): IConnectorState {
  const { connectedAccounts, providers, signTransactions } = useUseWallet();
  // state
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [network, setNetwork] = useState<INetwork | null>(null);
  // actions
  const connectAction = async (network: INetwork) => {
    const provider: Provider | null =
      providers?.find((value) => value.metadata.id === PROVIDER_ID.KIBISIS) ||
      null;

    if (!provider) {
      toast({
        status: 'error',
        title: `Use Wallet Provider Not Initialized`,
      });

      return;
    }

    setNetwork(network);

    if (!provider.isConnected) {
      await provider.connect();

      toast({
        description: `Successfully connected via UseWallet.`,
        status: 'success',
        title: 'Connected!',
      });
    }
  };
  const disconnectAction = async () => {
    const provider: Provider | null =
      providers?.find((value) => value.metadata.id === PROVIDER_ID.KIBISIS) ||
      null;

    setEnabledAccounts([]);
    setNetwork(null);

    if (provider?.isConnected) {
      await provider.disconnect();

      toast({
        description: `Successfully disconnected via UseWallet.`,
        status: 'success',
        title: 'Disconnected!',
      });
    }
  };
  const signMessageAction = () => {
    toast({
      description: `UseWallet does not support signing of messages.`,
      status: 'error',
      title: 'Not Supported!',
    });

    throw new Error(`signing a message not supported by use-wallet`);
  };
  const signTransactionsAction = async (
    transactions: IARC0001Transaction[]
  ) => {
    const result = await signTransactions(
      transactions.map(({ txn }) => decodeBase64(txn)),
      transactions.map((_, index) => index),
      true
    );

    return result.map(encodeBase64);
  };

  useEffect(() => {
    if (network) {
      (async () => {
        setEnabledAccounts(
          await Promise.all(
            connectedAccounts.map<Promise<IAccountInformation>>(
              ({ address, name }) =>
                getAccountInformation({ address, name }, network)
            )
          )
        );
      })();
    }
  }, [connectedAccounts]);

  return {
    connectAction,
    disconnectAction,
    enabledAccounts,
    signMessageAction,
    signTransactionsAction,
  };
}
