import {
  decodeURLSafe as decodeBase64Url,
  encode as encodeBase64,
} from '@stablelib/base64';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { InfinitySpin } from 'react-loader-spinner';

// Components
import PageShell from '@extension/components/PageShell';

// Features
import { setSignBytesRequest } from '@extension/features/messages';

// Selectors
import {
  useSelectSelectedNetwork,
  useSelectSessions,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAppThunkDispatch, INetwork, ISession } from '@extension/types';

// Utils
import { getAuthorizedAddressesForHost } from '@extension/utils';

const SignBytesPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const sessions: ISession[] = useSelectSessions();

  useEffect(() => {
    const url: URL = new URL(window.location.href);
    const encodedDataUrlSafe: string | null =
      url.searchParams.get('encodedData');
    let host: string;
    let rawDecodedData: Uint8Array;
    let tabId: number;

    if (selectedNetwork && sessions.length > 0 && encodedDataUrlSafe) {
      host = url.searchParams.get('host') || t<string>('labels.unknownHost');
      rawDecodedData = decodeBase64Url(encodedDataUrlSafe);
      tabId = parseInt(url.searchParams.get('tabId') || 'unknown');

      dispatch(
        setSignBytesRequest({
          appName:
            url.searchParams.get('appName') || t<string>('labels.unknownApp'),
          authorizedAddresses: getAuthorizedAddressesForHost(host, sessions),
          encodedData: encodeBase64(rawDecodedData),
          host,
          iconUrl: url.searchParams.get('iconUrl'),
          signer: url.searchParams.get('signer'),
          tabId,
        })
      );
    }
  }, [selectedNetwork, sessions]);

  return (
    <PageShell>
      <InfinitySpin color={theme.colors.primary['500']} width="200" />
    </PageShell>
  );
};

export default SignBytesPage;
