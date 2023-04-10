import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

// Constants
import {
  CREATE_NEW_ACCOUNT_ROUTE,
  IMPORT_EXISTING_ACCOUNT_ROUTE,
} from '@extension/constants';

// Features
import { saveCredentialsThunk } from '@extension/features/registration';

// Pages
import AccountSetupPage from '@extension/pages/AccountSetupPage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import ImportExistingAccountPage from '@extension/pages/ImportExistingAccountPage';

// Types
import {
  IAddAccountCompleteFunction,
  IAddAccountCompleteResult,
  IAppThunkDispatch,
} from '@extension/types';

const RegistrationAddAccountRouter: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const handleOnAddAccountComplete: IAddAccountCompleteFunction = ({
    name,
    privateKey,
  }: IAddAccountCompleteResult) => {
    dispatch(
      saveCredentialsThunk({
        name,
        privateKey,
      })
    );
  };

  return (
    <Routes>
      <Route element={<AccountSetupPage />} path="/" />
      <Route
        element={
          <CreateNewAccountPage onComplete={handleOnAddAccountComplete} />
        }
        path={CREATE_NEW_ACCOUNT_ROUTE}
      />
      <Route
        element={
          <ImportExistingAccountPage onComplete={handleOnAddAccountComplete} />
        }
        path={IMPORT_EXISTING_ACCOUNT_ROUTE}
      />
    </Routes>
  );
};

export default RegistrationAddAccountRouter;
