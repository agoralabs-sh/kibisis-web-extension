import { Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import CreatePasswordInput, {
  validate,
} from '@extension/components/CreatePasswordInput';
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
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import ChangePasswordLoadingModal from '@extension/modals/ChangePasswordLoadingModal';
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';

// types
import { IAppThunkDispatch } from '@extension/types';

const ChangePasswordPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
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
  const subTextColor = useSubTextColor();
  // state
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [score, setScore] = useState<number>(-1);
  // misc
  const isLoading = encrypting || validating;
  // handlers
  const handlePasswordChange = (newPassword: string, newScore: number) => {
    setNewPassword(newPassword);
    setScore(newScore);
  };
  const handleChangeClick = () => {
    if (!validate(newPassword || '', score, t)) {
      onConfirmPasswordModalOpen();
    }
  };
  const handleOnConfirmPasswordModalConfirm = async (
    currentPassword: string
  ) => {
    onConfirmPasswordModalClose();

    // save the new password
    if (newPassword) {
      await changePasswordAction({
        currentPassword,
        newPassword,
      });
    }
  };
  const reset = () => {
    setNewPassword(null);
    setScore(-1);
    resetAction();
  };

  // if there is an error from the hook, show a toast
  useEffect(() => {
    if (error) {
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
    }
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

          <CreatePasswordInput
            disabled={isLoading}
            label={t<string>('labels.newPassword')}
            onChange={handlePasswordChange}
            score={score}
            value={newPassword || ''}
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
