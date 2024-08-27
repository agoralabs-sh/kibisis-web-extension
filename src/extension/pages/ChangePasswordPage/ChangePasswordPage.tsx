import { Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import NewPasswordInput from '@extension/components/NewPasswordInput';
import PageHeader from '@extension/components/PageHeader';

// constants
import {
  DEFAULT_GAP,
  SECURITY_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useChangePassword from '@extension/hooks/useChangePassword';
import useNewPasswordInput from '@extension/hooks/useNewPasswordInput';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import ChangePasswordLoadingModal from '@extension/modals/ChangePasswordLoadingModal';
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

const ChangePasswordPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const navigate = useNavigate();
  const {
    isOpen: isConfirmPasswordModalOpen,
    onClose: onConfirmPasswordModalClose,
    onOpen: onConfirmPasswordModalOpen,
  } = useDisclosure();
  // hooks
  const {
    changePasswordAction,
    encryptionProgressState,
    encrypting,
    error,
    passwordTag,
    resetAction,
    validating,
  } = useChangePassword();
  const {
    error: newPasswordError,
    label: newPasswordLabel,
    onBlur: handleOnNewPasswordBlur,
    onChange: handleOnNewPasswordChange,
    required: isNewPasswordRequired,
    reset: resetNewPassword,
    score: newPasswordScore,
    validate: newPasswordValidate,
    value: newPasswordValue,
  } = useNewPasswordInput({
    label: t<string>('labels.newPassword'),
    required: true,
  });
  const subTextColor = useSubTextColor();
  // misc
  const isLoading = encrypting || validating;
  // handlers
  const handleChangeClick = () => {
    if (
      !!newPasswordError ||
      !!newPasswordValidate({
        score: newPasswordScore,
        value: newPasswordValue,
      })
    ) {
      return;
    }

    onConfirmPasswordModalOpen();
  };
  const handleOnConfirmPasswordModalConfirm = async (
    currentPassword: string
  ) => {
    let success: boolean;

    if (!newPasswordValue) {
      return;
    }

    // save the new password
    success = await changePasswordAction({
      currentPassword,
      newPassword: newPasswordValue,
    });

    if (success) {
      dispatch(
        createNotification({
          ephemeral: true,
          title: t<string>('headings.passwordChanged'),
          type: 'info',
        })
      );
      navigate(`${SETTINGS_ROUTE}${SECURITY_ROUTE}`, {
        replace: true,
      });

      // clean up
      reset();
    }
  };
  const reset = () => {
    resetNewPassword();
    resetAction();
  };

  // if there is an error from the hook, show a toast
  useEffect(() => {
    error &&
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
  }, [error]);
  // if we have the updated password tag navigate back
  useEffect(() => {
    if (passwordTag) {
      navigate(`${SETTINGS_ROUTE}${SECURITY_ROUTE}`, {
        replace: true,
      });

      reset();
    }
  }, [passwordTag]);

  return (
    <>
      <ChangePasswordLoadingModal
        encryptionProgressState={encryptionProgressState}
        isOpen={isLoading}
      />
      <ConfirmPasswordModal
        isOpen={isConfirmPasswordModalOpen}
        onClose={onConfirmPasswordModalClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
      />

      <PageHeader
        title={t<string>('titles.page', { context: 'changePassword' })}
      />

      <VStack
        flexGrow={1}
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={DEFAULT_GAP + 2}
        w="full"
      >
        <VStack flexGrow={1} spacing={DEFAULT_GAP / 2} w="full">
          <Text color={subTextColor} fontSize="sm" textAlign="left" w="full">
            {t<string>('captions.changePassword1')}
          </Text>

          <Text color={subTextColor} fontSize="sm" textAlign="left" w="full">
            {t<string>('captions.changePassword2')}
          </Text>

          <NewPasswordInput
            error={newPasswordError}
            isDisabled={isLoading}
            label={newPasswordLabel}
            onBlur={handleOnNewPasswordBlur}
            onChange={handleOnNewPasswordChange}
            required={isNewPasswordRequired}
            score={newPasswordScore}
            value={newPasswordValue}
          />
        </VStack>

        <Button
          isLoading={isLoading}
          onClick={handleChangeClick}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.changePassword')}
        </Button>
      </VStack>
    </>
  );
};

export default ChangePasswordPage;
