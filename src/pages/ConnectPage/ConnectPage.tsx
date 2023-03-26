import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { InfinitySpin } from 'react-loader-spinner';

// Components
import ConnectModal from '../../components/ConnectModal';
import PageShell from '../../components/PageShell';

// Features
import { fetchAccounts } from '../../features/accounts';
import { fetchSettings } from '../../features/settings';
import { setConnectRequest } from '../../features/sessions';

// Selectors
import { useSelectNetworks, useSelectSelectedNetwork } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAppThunkDispatch, INetwork } from '../../types';

const ConnectPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const networks: INetwork[] = useSelectNetworks();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const handleConnectModalClose = () => {
    dispatch(setConnectRequest(null));
  };

  useEffect(() => {
    dispatch(fetchSettings());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    const url: URL = new URL(window.location.href);
    let network: INetwork;
    let tabId: number;

    if (selectedNetwork) {
      dispatch(fetchAccounts());

      network =
        networks.find(
          (value) => value.genesisHash === url.searchParams.get('genesisHash')
        ) || selectedNetwork;
      tabId = parseInt(url.searchParams.get('tabId') || 'unknwon');

      dispatch(
        setConnectRequest({
          appName:
            url.searchParams.get('appName') || t<string>('labels.unknownApp'),
          authorizedAddresses: [],
          genesisHash: network.genesisHash,
          genesisId: network.genesisId,
          host: url.searchParams.get('host') || t<string>('labels.unknownHost'),
          iconUrl: url.searchParams.get('iconUrl'),
          tabId,
        })
      );
    }
  }, [selectedNetwork]);

  return (
    <>
      <ConnectModal onClose={handleConnectModalClose} />
      <PageShell noPadding={true}>
        <InfinitySpin color={theme.colors.primary['500']} width="200" />
      </PageShell>
    </>
  );
};

export default ConnectPage;
