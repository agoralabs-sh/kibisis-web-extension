import { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import { useEffect, useState } from 'react';

// selectors
import { useSelectLogger } from '../../selectors';

// types
import type { INetwork } from '@extension/types';
import type {
  IAccountInformation,
  IConnectorParams,
  IConnectorState,
  ISignMessageActionResult,
} from '../../types';

// utils
import {
  getAccountInformation,
  extractWalletConnectNamespaceFromNetwork,
} from '../../utils';

export default function useWalletConnectConnector({
  toast,
}: IConnectorParams): IConnectorState {
  const _hookName = 'useWalletConnectConnector';
  const projectId = '0451c3741ac5a5eba94c213ee1073cb1';
  // selectors
  const logger = useSelectLogger();
  // state
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [network, setNetwork] = useState<INetwork | null>(null);
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  // actions
  const connectAction = async (_network: INetwork) => {
    const _functionName = 'connectAction';
    const _signClient = await getOrInitializeSignClient();
    const namespace = extractWalletConnectNamespaceFromNetwork(_network);
    let _session: SessionTypes.Struct;
    let modal: WalletConnectModal | null = null;

    try {
      const { approval, uri } = await _signClient.connect({
        requiredNamespaces: {
          [_network.namespace.key]: namespace,
        },
      });

      if (uri) {
        modal = new WalletConnectModal({
          projectId,
          chains: namespace.chains,
        });

        await modal.openModal({ uri });
      }

      _session = await approval();
    } catch (error) {
      logger.error(`${_hookName}#${_functionName}:`, error);

      toast({
        description: 'Check browser console for more information.',
        status: 'error',
        title: 'Failed To Connect To WalletConnect',
      });

      modal && modal.closeModal();

      return false;
    }

    logger.debug(`${_hookName}#${_functionName}: acquired session`, _session);

    setNetwork(_network);
    setSession(_session);

    modal && modal.closeModal();

    return true;
  };
  const disconnectAction = () => {
    return;
  };
  const signMessageAction = (): Promise<ISignMessageActionResult> => {
    toast({
      description: `WalletConnect does not support signing of messages.`,
      status: 'error',
      title: 'Not Supported!',
    });

    throw new Error(`signing a message not supported by wallet connect`);
  };
  const signTransactionsAction = async (
    transactions: IARC0001Transaction[]
  ) => {
    return [];
  };
  // misc
  const getOrInitializeSignClient = async () => {
    const _functionName = 'getOrInitializeSignClient';
    let _signClient: SignClient;
    let descriptionMetaElement: HTMLMetaElement | null;

    if (signClient) {
      return signClient;
    }

    descriptionMetaElement = window.document.querySelector(
      'meta[name="description"]'
    );
    _signClient = await SignClient.init({
      metadata: {
        description:
          descriptionMetaElement?.content ||
          'A simple dApp to test the features of the Kibisis wallet',
        icons: [
          `${window.location.protocol}//${window.location.host}/favicon.png`,
        ],
        name: window.document.title,
        url: `${window.location.protocol}//${window.location.host}`,
      },
      projectId,
    });
    _signClient.on('session_update', ({ topic, params }) => {
      const _session = {
        ..._signClient.session.get(topic),
        namespace: params.namespaces,
      };

      logger.debug(`${_hookName}#${_functionName}: session updated`, _session);

      setSession(_session);
    });
    _signClient.on('session_delete', () => {
      logger.debug(`${_hookName}#${_functionName}: session deleted`);

      setSession(null);
      setEnabledAccounts([]);
    });

    setSignClient(_signClient);

    return _signClient;
  };

  // when the session is updated
  useEffect(() => {
    const _functionName = 'useEffect';

    (async () => {
      let addresses: string[];

      if (!network || !session) {
        return;
      }

      // extract the addresses from the caip format of: <namespace>:<address>
      addresses = session.namespaces[network.namespace.key].accounts.reduce(
        (acc, value) => {
          const address = value.split(':').pop() || null;

          return address ? [...acc, address] : acc;
        },
        []
      );

      try {
        setEnabledAccounts(
          await Promise.all(
            addresses.map<Promise<IAccountInformation>>((address) =>
              getAccountInformation({ address }, network)
            )
          )
        );
      } catch (error) {
        logger.error(`${_hookName}#${_functionName}:`, error);

        toast({
          description: 'Check browser console for more information.',
          status: 'error',
          title: 'Failed To Get Account Information',
        });
      }
    })();
  }, [network, session]);

  return {
    connectAction,
    disconnectAction,
    enabledAccounts,
    signMessageAction,
    signTransactionsAction,
  };
}
