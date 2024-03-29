import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Route, Routes, useNavigate } from 'react-router-dom';

// constants
import {
  ACCOUNTS_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE,
} from '@extension/constants';

// enums
import {
  AccountTabEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
} from '@extension/enums';

// features
import {
  ISaveNewAccountPayload,
  saveActiveAccountDetails,
  saveNewAccountThunk,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';
import { setScanQRCodeModal } from '@extension/features/system';

// modals
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';

// pages
import AddAccountTypePage from '@extension/pages/AddAccountTypePage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import ImportAccountViaSeedPhrasePage from '@extension/pages/ImportAccountViaSeedPhrasePage';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccountDetails,
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
  IActiveAccountDetails,
  IAddAccountCompleteResult,
  IAppThunkDispatch,
  ISettings,
} from '@extension/types';

// utils
import convertPrivateKeyToAddress from '@extension/utils/convertPrivateKeyToAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const AddAccountMainRouter: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const activeAccountDetails: IActiveAccountDetails | null =
    useSelectActiveAccountDetails();
  const logger: ILogger = useSelectLogger();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const saving: boolean = useSelectSavingAccounts();
  const settings: ISettings = useSelectSettings();
  // states
  const [addAccountResult, setAddAccountResult] =
    useState<IAddAccountCompleteResult | null>(null);
  // handlers
  const handleOnAddAccountComplete = async ({
    name,
    privateKey,
  }: IAddAccountCompleteResult) => {
    // if the password lock is enabled and the password is active, just submit the result
    if (settings.security.enablePasswordLock && passwordLockPassword) {
      await saveNewAccount({
        name,
        password: passwordLockPassword,
        privateKey,
      });

      return;
    }

    // set the result to state, in order for the password confirm modal to handle the encryption
    setAddAccountResult({
      name,
      privateKey,
    });
  };
  const handleOnConfirmPasswordModalClose = () => setAddAccountResult(null);
  const handleOnConfirmPasswordModalConfirm = async (password: string) => {
    if (!addAccountResult) {
      return;
    }

    await saveNewAccount({
      name: addAccountResult.name,
      password,
      privateKey: addAccountResult.privateKey,
    });
  };
  const handleImportAccountViaQRCodeClick = () =>
    dispatch(
      setScanQRCodeModal({
        // only allow account import
        allowedAuthorities: [ARC0300AuthorityEnum.Account],
        allowedParams: [ARC0300PathEnum.Import],
      })
    );
  const saveNewAccount = async ({
    name,
    password,
    privateKey,
  }: ISaveNewAccountPayload) => {
    const _functionName: string = 'saveNewAccount';
    let account: IAccount;

    if (addAccountResult) {
      try {
        account = await dispatch(
          saveNewAccountThunk({
            name,
            password,
            privateKey,
          })
        ).unwrap();
      } catch (error) {
        logger.error(`${AddAccountMainRouter.name}#${_functionName}:`, error);

        dispatch(
          createNotification({
            description: t<string>('errors.descriptions.code', {
              code: error.code,
              context: error.code,
            }),
            ephemeral: true,
            title: t<string>('errors.titles.code', { context: error.code }),
            type: 'error',
          })
        );

        return;
      }

      dispatch(
        createNotification({
          ephemeral: true,
          description: t<string>('captions.addedAccount', {
            address: ellipseAddress(
              AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )
            ),
          }),
          title: t<string>('headings.addedAccount'),
          type: 'success',
        })
      );
    }
  };

  useEffect(() => {
    let account: IAccount | null;
    let address: string | null;

    if (addAccountResult) {
      address = convertPrivateKeyToAddress(addAccountResult.privateKey, {
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
          dispatch(
            saveActiveAccountDetails({
              accountId: account.id,
              tabIndex: activeAccountDetails?.tabIndex || AccountTabEnum.Assets,
            })
          );
          navigate(ACCOUNTS_ROUTE, {
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
        {/*add account type page*/}
        <Route
          element={
            <AddAccountTypePage
              onImportAccountViaQRCodeClick={handleImportAccountViaQRCodeClick}
            />
          }
          path="/"
        />

        {/*create account page*/}
        <Route
          element={
            <CreateNewAccountPage
              onComplete={handleOnAddAccountComplete}
              saving={saving}
            />
          }
          path={CREATE_NEW_ACCOUNT_ROUTE}
        />

        {/*import account via seed phrase page*/}
        <Route
          element={
            <ImportAccountViaSeedPhrasePage
              onComplete={handleOnAddAccountComplete}
              saving={saving}
            />
          }
          path={IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE}
        />
      </Routes>
    </>
  );
};

export default AddAccountMainRouter;
