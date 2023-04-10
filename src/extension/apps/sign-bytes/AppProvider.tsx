import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Components
import SignBytesModal from '@extension/components/SignBytesModal';

// Features
import { checkInitializedThunk } from '@extension/features/application';
import { fetchAccountsThunk } from '@extension/features/accounts';
import { setSignBytesRequest } from '@extension/features/messages';
import { fetchSessionsThunk } from '@extension/features/sessions';
import { fetchSettings } from '@extension/features/settings';

// Selectors
import { useSelectSelectedNetwork } from '@extension/selectors';

// Types
import { IAppThunkDispatch, INetwork } from '@extension/types';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const handleSignBytesModalClose = () => dispatch(setSignBytesRequest(null));

  useEffect(() => {
    dispatch(checkInitializedThunk());
    dispatch(fetchSettings());
    dispatch(fetchSessionsThunk());
  }, []);
  // fetch accounts when the selected network has been found
  useEffect(() => {
    if (selectedNetwork) {
      dispatch(fetchAccountsThunk());
    }
  }, [selectedNetwork]);

  return (
    <>
      <SignBytesModal onClose={handleSignBytesModalClose} />
      {children}
    </>
  );
};

export default AppProvider;
