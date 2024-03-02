import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NavigateFunction, Route, Routes, useNavigate } from 'react-router-dom';

// constants
import {
  CREATE_NEW_ACCOUNT_ROUTE,
  CREATE_PASSWORD_ROUTE,
  IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE,
} from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// features
import { sendRegistrationCompletedThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';
import {
  saveCredentialsThunk,
  setImportAccountViaQRCodeOpen,
} from '@extension/features/registration';

// modals
import RegistrationImportAccountViaQRCodeModal from '@extension/modals/RegistrationImportAccountViaQRCodeModal';

// pages
import AddAccountTypePage from '@extension/pages/AddAccountTypePage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import ImportAccountViaSeedPhrasePage from '@extension/pages/ImportAccountViaSeedPhrasePage';

// selectors
import {
  useSelectRegistrationImportAccountViaQRCodeOpen,
  useSelectRegistrationSaving,
} from '@extension/selectors';

// types
import type {
  IAddAccountCompleteFunction,
  IAddAccountCompleteResult,
  IAppThunkDispatch,
  IRegistrationRootState,
} from '@extension/types';

const AddAccountRegistrationRouter: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch<IRegistrationRootState> =
    useDispatch<IAppThunkDispatch<IRegistrationRootState>>();
  const navigate: NavigateFunction = useNavigate();
  // selectors
  const importAccountViaQRCodeOpen: boolean =
    useSelectRegistrationImportAccountViaQRCodeOpen();
  const saving: boolean = useSelectRegistrationSaving();
  // handlers
  const handleOnAddAccountComplete: IAddAccountCompleteFunction = async ({
    arc0200Assets,
    name,
    privateKey,
  }: IAddAccountCompleteResult) => {
    try {
      await dispatch(
        saveCredentialsThunk({
          arc0200Assets,
          name,
          privateKey,
        })
      ).unwrap();

      // send a message that registration has been completed
      dispatch(sendRegistrationCompletedThunk());
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          navigate(CREATE_PASSWORD_ROUTE);

          break;
        default:
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
          break;
      }
    }
  };
  const handleOnImportAccountViaQRCodeClose = () =>
    dispatch(setImportAccountViaQRCodeOpen(false));
  const handleOnImportAccountViaQRCodeOpen = () =>
    dispatch(setImportAccountViaQRCodeOpen(true));

  return (
    <>
      <RegistrationImportAccountViaQRCodeModal
        isOpen={importAccountViaQRCodeOpen}
        onClose={handleOnImportAccountViaQRCodeClose}
        onComplete={handleOnAddAccountComplete}
        saving={saving}
      />

      <Routes>
        {/*add account type page*/}
        <Route
          element={
            <AddAccountTypePage
              onImportAccountViaQRCodeClick={handleOnImportAccountViaQRCodeOpen}
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

export default AddAccountRegistrationRouter;
