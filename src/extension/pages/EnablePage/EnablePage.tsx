import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import LoadingPage from '@extension/components/LoadingPage';

// Features
import { setEnableRequest } from '@extension/features/messages';

// Selectors
import {
  useSelectNetworks,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// Types
import { IAppThunkDispatch, INetwork } from '@extension/types';

// Utils
import { decodeURLSearchParam } from '@extension/utils';

const EnablePage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const networks: INetwork[] = useSelectNetworks();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();

  // fetch accounts when the selected network has been found
  useEffect(() => {
    const url: URL = new URL(window.location.href);
    let network: INetwork;
    let tabId: number;

    if (selectedNetwork) {
      network =
        networks.find(
          (value) =>
            value.genesisHash ===
            decodeURLSearchParam('genesisHash', url.searchParams)
        ) || selectedNetwork;
      tabId = parseInt(
        decodeURLSearchParam('tabId', url.searchParams) || 'unknown'
      );

      dispatch(
        setEnableRequest({
          appName:
            decodeURLSearchParam('appName', url.searchParams) ||
            t<string>('labels.unknownApp'),
          authorizedAddresses: [],
          description: decodeURLSearchParam('description', url.searchParams),
          genesisHash: network.genesisHash,
          genesisId: network.genesisId,
          host:
            decodeURLSearchParam('host', url.searchParams) ||
            t<string>('labels.unknownHost'),
          iconUrl: decodeURLSearchParam('iconUrl', url.searchParams),
          tabId,
        })
      );
    }
  }, [selectedNetwork]);

  return <LoadingPage />;
};

export default EnablePage;
