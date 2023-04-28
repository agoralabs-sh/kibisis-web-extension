import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Route, Routes, useNavigate } from 'react-router-dom';

// Components
import ConfirmPasswordModal from '@extension/components/ConfirmPasswordModal';

// Constants
import {
  ACCOUNTS_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  IMPORT_EXISTING_ACCOUNT_ROUTE,
} from '@extension/constants';

// Features
import {
  saveNewAccountThunk,
  updateAccountInformationThunk,
} from '@extension/features/accounts';

// Pages
import AccountSetupPage from '@extension/pages/AccountSetupPage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import ImportExistingAccountPage from '@extension/pages/ImportExistingAccountPage';

// Selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectSavingAccounts,
} from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAddAccountCompleteFunction,
  IAddAccountCompleteResult,
  IAppThunkDispatch,
} from '@extension/types';

// Utils
import { getAddressFromPrivateKey } from '@extension/utils';

const MainAddAccountRouter: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const logger: ILogger = useSelectLogger();
  const accounts: IAccount[] = useSelectAccounts();
  const saving: boolean = useSelectSavingAccounts();
  const [addAccountResult, setAddAccountResult] =
    useState<IAddAccountCompleteResult | null>(null);
  const handleOnAddAccountComplete: IAddAccountCompleteFunction = ({
    name,
    privateKey,
  }: IAddAccountCompleteResult) =>
    setAddAccountResult({
      name,
      privateKey,
    });
  const handleOnConfirmPasswordModalClose = () => setAddAccountResult(null);
  const handleOnConfirmPasswordModalConfirm = (password: string) => {
    if (addAccountResult) {
      dispatch(
        saveNewAccountThunk({
          name: addAccountResult.name,
          password,
          privateKey: addAccountResult.privateKey,
        })
      );
    }
  };

  useEffect(() => {
    let address: string | null;

    if (addAccountResult) {
      address = getAddressFromPrivateKey(addAccountResult.privateKey, {
        logger,
      });

      // if the account has been added, navigate to the account and clean up
      if (
        address &&
        accounts.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === address
        )
      ) {
        setAddAccountResult(null);
        dispatch(updateAccountInformationThunk());
        navigate(`${ACCOUNTS_ROUTE}/${address}`, {
          replace: true,
        });
      }
    }
  }, [accounts]);

  return (
    <>
      <ConfirmPasswordModal
        isOpen={!!addAccountResult}
        onCancel={handleOnConfirmPasswordModalClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
      />
      <Routes>
        <Route element={<AccountSetupPage />} path="/" />
        <Route
          element={
            <CreateNewAccountPage
              onComplete={handleOnAddAccountComplete}
              saving={saving}
            />
          }
          path={CREATE_NEW_ACCOUNT_ROUTE}
        />
        <Route
          element={
            <ImportExistingAccountPage
              onComplete={handleOnAddAccountComplete}
              saving={saving}
            />
          }
          path={IMPORT_EXISTING_ACCOUNT_ROUTE}
        />
      </Routes>
    </>
  );
};

export default MainAddAccountRouter;
