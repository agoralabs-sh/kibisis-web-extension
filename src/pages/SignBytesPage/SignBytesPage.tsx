import {
  decodeURLSafe as decodeBase64Url,
  encode as encodeBase64,
} from '@stablelib/base64';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { InfinitySpin } from 'react-loader-spinner';

// Components
import MainPageShell from '../../components/MainPageShell';
import SignDataModal from '../../components/SignDataModal';

// Features
import { fetchAccounts, setSignDataRequest } from '../../features/accounts';
import { fetchSessions } from '../../features/sessions';
import { fetchSettings } from '../../features/settings';

// Selectors
import { useSelectAccounts, useSelectSessions } from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAccount, IAppThunkDispatch, ISession } from '../../types';

// Utils
import { getAuthorizedAddressesForHost } from '../../utils';

const SignBytesPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const accounts: IAccount[] = useSelectAccounts();
  const sessions: ISession[] = useSelectSessions();
  const handleSignBytesModalClose = () => dispatch(setSignDataRequest(null));

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(
      fetchAccounts({
        onlyFetchFromStorage: true, // only get the accounts from storage, we only need public addresses
      })
    );
    dispatch(fetchSessions());
  }, []);
  useEffect(() => {
    const url: URL = new URL(window.location.href);
    const encodedDataUrlSafe: string | null =
      url.searchParams.get('encodedData');
    let host: string;
    let rawDecodedData: Uint8Array;
    let tabId: number;

    if (accounts.length > 0 && sessions.length > 0 && encodedDataUrlSafe) {
      host = url.searchParams.get('host') || t<string>('labels.unknownHost');
      rawDecodedData = decodeBase64Url(encodedDataUrlSafe);
      tabId = parseInt(url.searchParams.get('tabId') || 'unknown');

      dispatch(
        setSignDataRequest({
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
  }, [accounts, sessions]);

  return (
    <>
      <SignDataModal onClose={handleSignBytesModalClose} />
      <MainPageShell>
        <InfinitySpin color={theme.colors.primary['500']} width="200" />
      </MainPageShell>
    </>
  );
};

export default SignBytesPage;
