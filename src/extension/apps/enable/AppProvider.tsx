import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Components
import EnableModal from '@extension/components/EnableModal';

// Features
import { fetchAccountsThunk } from '@extension/features/accounts';
import { setEnableRequest } from '@extension/features/messages';
import { fetchSessionsThunk } from '@extension/features/sessions';
import { fetchSettings } from '@extension/features/settings';

// Selectors
import { useSelectSelectedNetwork } from '@extension/selectors';

// Types
import { IAppThunkDispatch, INetwork } from '@extension/types';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const handleEnableModalClose = () => dispatch(setEnableRequest(null));

  useEffect(() => {
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
      <EnableModal onClose={handleEnableModalClose} />
      {children}
    </>
  );
};

export default AppProvider;
