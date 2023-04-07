import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { InfinitySpin } from 'react-loader-spinner';

// Components
import EnableModal from '../../components/EnableModal';
import MainPageShell from '../../components/MainPageShell';

// Features
import { fetchAccountsThunk } from '../../features/accounts';
import { setEnableRequest } from '../../features/messages';
import { fetchSettings } from '../../features/settings';

// Selectors
import { useSelectNetworks, useSelectSelectedNetwork } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAppThunkDispatch, INetwork } from '../../types';

// Utils
import { decodeURLSearchParam } from '../../utils';

const EnablePage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const networks: INetwork[] = useSelectNetworks();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const handleEnableModalClose = () => dispatch(setEnableRequest(null));

  useEffect(() => {
    dispatch(fetchSettings());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    const url: URL = new URL(window.location.href);
    let network: INetwork;
    let tabId: number;

    if (selectedNetwork) {
      dispatch(fetchAccountsThunk());

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

  return (
    <>
      <EnableModal onClose={handleEnableModalClose} />
      <MainPageShell>
        <InfinitySpin color={theme.colors.primary['500']} width="200" />
      </MainPageShell>
    </>
  );
};

export default EnablePage;
