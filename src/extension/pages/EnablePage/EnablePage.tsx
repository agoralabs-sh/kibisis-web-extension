import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { InfinitySpin } from 'react-loader-spinner';

// Components
import EnableModal from '@extension/components/EnableModal';
import PageShell from '@extension/components/PageShell';

// Features
import { fetchAccountsThunk } from '@extension/features/accounts';
import { setEnableRequest } from '@extension/features/messages';
import { fetchSettings } from '@extension/features/settings';

// Selectors
import {
  useSelectNetworks,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAppThunkDispatch, INetwork } from '@extension/types';

// Utils
import { decodeURLSearchParam } from '@extension/utils';

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
      <PageShell>
        <InfinitySpin color={theme.colors.primary['500']} width="200" />
      </PageShell>
    </>
  );
};

export default EnablePage;
