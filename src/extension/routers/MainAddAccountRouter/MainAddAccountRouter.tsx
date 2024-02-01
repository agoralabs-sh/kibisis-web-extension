import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Route, Routes, useNavigate } from 'react-router-dom';

// constants
import {
  ACCOUNTS_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  IMPORT_EXISTING_ACCOUNT_ROUTE,
} from '@extension/constants';

// features
import {
  saveNewAccountThunk,
  updateAccountsThunk,
} from '@extension/features/accounts';

// modals
import ConfirmPasswordModal from '@extension/modals//ConfirmPasswordModal';

// pages
import AccountSetupPage from '@extension/pages/AccountSetupPage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import ImportExistingAccountPage from '@extension/pages/ImportExistingAccountPage';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectSavingAccounts,
  useSelectSettings,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAddAccountCompleteFunction,
  IAddAccountCompleteResult,
  IAppThunkDispatch,
  ISettings,
} from '@extension/types';

// utils
import getAddressFromPrivateKey from '@extension/utils/getAddressFromPrivateKey';

const MainAddAccountRouter: FC = () => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const accounts: IAccount[] = useSelectAccounts();
  // selectors
  const logger: ILogger = useSelectLogger();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const saving: boolean = useSelectSavingAccounts();
  const settings: ISettings = useSelectSettings();
  // states
  const [addAccountResult, setAddAccountResult] =
    useState<IAddAccountCompleteResult | null>(null);
  // handlers
  const handleOnAddAccountComplete: IAddAccountCompleteFunction = ({
    name,
    privateKey,
  }: IAddAccountCompleteResult) => {
    // if the password lock is enabled and the password is active, just submit the result
    if (settings.security.enablePasswordLock && passwordLockPassword) {
      dispatch(
        saveNewAccountThunk({
          name,
          password: passwordLockPassword,
          privateKey,
        })
      );

      return;
    }

    // set the result to state, in order for the password confirm modal to handle the encryption
    setAddAccountResult({
      name,
      privateKey,
    });
  };
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
    let account: IAccount | null;
    let address: string | null;

    if (addAccountResult) {
      address = getAddressFromPrivateKey(addAccountResult.privateKey, {
        logger,
      });

      if (address) {
        // if the account has been added, navigate to the account and update
        account =
          accounts.find(
            (value) =>
              AccountService.convertPublicKeyToAlgorandAddress(
                value.publicKey
              ) === address
          ) || null;

        if (account) {
          setAddAccountResult(null);
          dispatch(
            updateAccountsThunk({
              accountIds: [account.id],
            })
          );
          navigate(`${ACCOUNTS_ROUTE}/${address}`, {
            replace: true,
          });
        }
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
