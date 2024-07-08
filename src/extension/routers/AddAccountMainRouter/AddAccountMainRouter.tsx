import { useDisclosure } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
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

// features
import {
  saveActiveAccountDetails,
  saveNewAccountThunk,
  saveNewWatchAccountThunk,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { setScanQRCodeModal } from '@extension/features/layout';
import { create as createNotification } from '@extension/features/notifications';

// modals
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';

// pages
import AddAccountTypePage from '@extension/pages/AddAccountTypePage';
import AddWatchAccountPage, {
  IAddWatchAccountCompleteResult,
} from '@extension/pages/AddWatchAccountPage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import ImportAccountViaSeedPhrasePage from '@extension/pages/ImportAccountViaSeedPhrasePage';

// selectors
import {
  useSelectActiveAccountDetails,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectAccountsSaving,
  useSelectSettings,
} from '@extension/selectors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
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
    isOpen: isConfirmPasswordModalOpen,
    onClose: onConfirmPasswordModalClose,
    onOpen: onConfirmPasswordModalOpen,
  } = useDisclosure();
  // selectors
  const activeAccountDetails = useSelectActiveAccountDetails();
  const logger = useSelectLogger();
  const passwordLockPassword = useSelectPasswordLockPassword();
  const saving = useSelectAccountsSaving();
  const settings = useSelectSettings();
  // states
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  // handlers
  const handleOnAddAccountComplete = async ({
    name,
    privateKey,
  }: IAddAccountCompleteResult) => {
    setName(name);
    setPrivateKey(privateKey);

    // if the password lock is enabled and the password is active, use the password
    if (settings.security.enablePasswordLock && passwordLockPassword) {
      setPassword(passwordLockPassword);

      return;
    }

    // get the password from the modal
    onConfirmPasswordModalOpen();
  };
  const handleOnAddWatchAccountComplete = async ({
    address,
    name,
  }: IAddWatchAccountCompleteResult) => {
    const _functionName = 'handleOnAddWatchAccountComplete';
    let account: IAccountWithExtendedProps;

    try {
      account = await dispatch(
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
            convertPublicKeyToAVMAddress(
              PrivateKeyService.decode(account.publicKey)
            )
          ),
        }),
        title: t<string>('headings.addedAccount'),
        type: 'success',
      })
    );

    updateAccounts(account.id);
    reset();
  };
  const handleOnConfirmPasswordModalClose = () => onConfirmPasswordModalClose();
  const handleOnConfirmPasswordModalConfirm = async (password: string) => {
    setPassword(password);
    onConfirmPasswordModalClose();
  };
  const handleImportAccountViaQRCodeClick = () =>
    dispatch(
      setScanQRCodeModal({
        // only allow account import
        allowedAuthorities: [ARC0300AuthorityEnum.Account],
        allowedParams: [ARC0300PathEnum.Import],
      })
    );
  // misc
  const reset = () => {
    setName(null);
    setPassword(null);
    setPrivateKey(null);
  };
  const saveNewAccount = async () => {
    const _functionName = 'saveNewAccount';
    let account: IAccountWithExtendedProps;

    if (!password || !privateKey) {
      return;
    }

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
            convertPublicKeyToAVMAddress(
              PrivateKeyService.decode(account.publicKey)
            )
          ),
        }),
        title: t<string>('headings.addedAccount'),
        type: 'success',
      })
    );

    updateAccounts(account.id);
    reset();
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

  // if we have the password and the private key, we can save a new account
  useEffect(() => {
    if (password && privateKey) {
      (async () => await saveNewAccount())();
    }
  }, [password, privateKey]);

  return (
    <>
      <ConfirmPasswordModal
        isOpen={isConfirmPasswordModalOpen}
        onCancel={handleOnConfirmPasswordModalClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
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
