import { AVMWebClient, IEnableResult } from '@agoralabs-sh/avm-web-provider';
import { useState } from 'react';

// types
import type { INetwork } from '@extension/types';
import type {
  IAccountInformation,
  IConnectorParams,
  IConnectorState,
} from '../../types';

// utils
import { getAccountInformation } from '../../utils';

export default function useAVMWebProviderConnector({
  toast,
}: IConnectorParams): IConnectorState {
  // state
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [avmWebClient, setAVMWebClient] = useState<AVMWebClient | null>(null);
  // actions
  const connectAction = (network: INetwork) => {
    let _avmWebClient: AVMWebClient = getOrInitializeAVMWebClient();

    _avmWebClient.onEnable(async ({ accounts }: IEnableResult) => {
      setEnabledAccounts(
        await Promise.all(
          accounts.map<Promise<IAccountInformation>>(({ address, name }) =>
            getAccountInformation({ address, name }, network)
          )
        )
      );

      toast({
        description: `Successfully connected via AVM Web Provider.`,
        status: 'success',
        title: 'Connected!',
      });
    });
    _avmWebClient.enable({
      genesisHash: network.genesisHash,
      providerId: __PROVIDER__,
    });
  };
  const disconnectAction = () => {
    let _avmWebClient: AVMWebClient = getOrInitializeAVMWebClient();

    _avmWebClient.onDisable(() => {
      toast({
        description: `Successfully disconnected via AVM Web Provider.`,
        status: 'success',
        title: 'Disconnected!',
      });
    });
    _avmWebClient.disable({
      providerId: __PROVIDER__,
    });
  };
  // misc
  const getOrInitializeAVMWebClient = () => {
    let _avmWebClient: AVMWebClient;

    if (avmWebClient) {
      return avmWebClient;
    }

    _avmWebClient = AVMWebClient.init({
      debug: true,
    });

    setAVMWebClient(_avmWebClient);

    return _avmWebClient;
  };

  return {
    connectAction,
    disconnectAction,
    enabledAccounts,
  };
}
