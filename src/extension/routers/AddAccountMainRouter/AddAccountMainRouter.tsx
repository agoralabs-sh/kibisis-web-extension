import { useDisclosure } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

// constants
import {
  ACCOUNTS_ROUTE,
  ADD_WATCH_ACCOUNT_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE,
} from '@extension/constants';

// enums
import {
  AccountTabEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
} from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import {
  saveActiveAccountDetails,
  saveNewAccountsThunk,
  saveNewWatchAccountThunk,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { setScanQRCodeModal } from '@extension/features/layout';
import { create as createNotification } from '@extension/features/notifications';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// pages
import AddAccountTypePage from '@extension/pages/AddAccountTypePage';
import AddWatchAccountPage from '@extension/pages/AddWatchAccountPage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import ImportAccountViaSeedPhrasePage from '@extension/pages/ImportAccountViaSeedPhrasePage';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccountDetails,
  useSelectLogger,
  useSelectAccountsSaving,
} from '@extension/selectors';

// types
import type { TOnConfirmResult } from '@extension/modals/AuthenticationModal';
import type { IAddWatchAccountCompleteResult } from '@extension/pages/AddWatchAccountPage';
import type {
  IAccountWithExtendedProps,
  IAddAccountCompleteResult,
  IAppThunkDispatch,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const AddAccountMainRouter: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccountDetails = useSelectActiveAccountDetails();
  const logger = useSelectLogger();
  const saving = useSelectAccountsSaving();
  // states
  const [keyPair, setKeyPair] = useState<Ed21559KeyPair | null>(null);
  const [name, setName] = useState<string | null>(null);
  // misc
  const reset = () => {
    setKeyPair(null);
    setName(null);
  };
  const updateAccounts = (accountId: string) => {
    dispatch(
      updateAccountsThunk({
        accountIds: [accountId],
      })
    );
    dispatch(
      saveActiveAccountDetails({
        accountId,
        tabIndex: activeAccountDetails?.tabIndex || AccountTabEnum.Assets,
      })
    );
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });
  };
  // handlers
  const handleImportAccountViaQRCodeClick = () =>
    dispatch(
      setScanQRCodeModal({
        // only allow account import
        allowedAuthorities: [ARC0300AuthorityEnum.Account],
        allowedParams: [ARC0300PathEnum.Import],
      })
    );
  const handleOnAddAccountComplete = async ({
    name,
    keyPair,
  }: IAddAccountCompleteResult) => {
    const account =
      accounts.find(
        ({ publicKey }) =>
          convertPublicKeyToAVMAddress(publicKey) ===
          convertPublicKeyToAVMAddress(keyPair.publicKey)
      ) || null;

    // if the account is already added
    if (account) {
      dispatch(
        createNotification({
          ephemeral: true,
          description: t<string>('captions.accountAlreadyAdded', {
            address: ellipseAddress(
              convertPublicKeyToAVMAddress(account.publicKey)
            ),
          }),
          title: t<string>('headings.accountAlreadyAdded'),
          type: 'info',
        })
      );

      return;
    }

    setKeyPair(keyPair);
    setName(name);

    onAuthenticationModalOpen();
  };
  const handleOnAuthenticationModalClose = () => onAuthenticationModalClose();
  const handleOnAddWatchAccountComplete = async ({
    address,
    name,
  }: IAddWatchAccountCompleteResult) => {
    const _functionName = 'handleOnAddWatchAccountComplete';
    const account =
      accounts.find(
        ({ publicKey }) => convertPublicKeyToAVMAddress(publicKey) === address
      ) || null;
    let _account: IAccountWithExtendedProps;

    // if the account is already added
    if (account) {
      dispatch(
        createNotification({
          ephemeral: true,
          description: t<string>('captions.accountAlreadyAdded', {
            address: ellipseAddress(
              convertPublicKeyToAVMAddress(account.publicKey)
            ),
          }),
          title: t<string>('headings.accountAlreadyAdded'),
          type: 'info',
        })
      );

      return;
    }

    try {
      _account = await dispatch(
        saveNewWatchAccountThunk({
          address,
          name,
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
            convertPublicKeyToAVMAddress(_account.publicKey)
          ),
        }),
        title: t<string>('headings.addedAccount'),
        type: 'success',
      })
    );

    updateAccounts(_account.id);
    reset();
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let _accounts: IAccountWithExtendedProps[];

    if (!keyPair) {
      return;
    }

    try {
      _accounts = await dispatch(
        saveNewAccountsThunk({
          accounts: [
            {
              keyPair,
              name,
            },
          ],
          ...result,
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
            convertPublicKeyToAVMAddress(keyPair.publicKey)
          ),
        }),
        title: t<string>('headings.addedAccount'),
        type: 'success',
      })
    );

    updateAccounts(_accounts[0].id);
    reset();
  };
  const handleOnError = (error: BaseExtensionError) =>
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

  return (
    <>
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={handleOnAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
      />

      <Routes>
        {/*add account type page*/}
        <Route
          element={
            <AddAccountTypePage
              allowAddWatchAccount={true}
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

        {/*add watch account page*/}
        <Route
          element={
            <AddWatchAccountPage
              onComplete={handleOnAddWatchAccountComplete}
              saving={saving}
            />
          }
          path={ADD_WATCH_ACCOUNT_ROUTE}
        />
      </Routes>
    </>
  );
};

export default AddAccountMainRouter;
