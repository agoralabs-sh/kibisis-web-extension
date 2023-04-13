import {
  Text,
  VStack,
  useDisclosure,
  CreateToastFnReturn,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '@extension/components/Button';
import ConfirmPasswordModal from '@extension/components/ConfirmPasswordModal';
import CreatePasswordInput, {
  validate,
} from '@extension/components/CreatePasswordInput';
import PageHeader from '@extension/components/PageHeader';

// Constants
import {
  DEFAULT_GAP,
  SECURITY_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

// Hooks
import useChangePassword from '@extension/hooks/useChangePassword';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import { useSelectToast } from '@extension/selectors';

const ChangePasswordPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast: CreateToastFnReturn | null = useSelectToast();
  const { changePassword, error, passwordTag, saving } = useChangePassword();
  const subTextColor: string = useSubTextColor();
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [score, setScore] = useState<number>(-1);
  const handlePasswordChange = (newPassword: string, newScore: number) => {
    setNewPassword(newPassword);
    setScore(newScore);
  };
  const handleChangeClick = () => {
    if (!validate(newPassword || '', score, t)) {
      onOpen();
    }
  };
  const handleOnConfirmPasswordModalConfirm = async (
    currentPassword: string
  ) => {
    onClose();

    // save the new password
    if (newPassword) {
      await changePassword(newPassword, currentPassword);
    }
  };

  // if there is an error from the hook, show a toast
  useEffect(() => {
    if (error && toast) {
      toast({
        description: error.message,
        duration: null,
        isClosable: true,
        status: 'error',
        title: `${error.code}: ${error.name}`,
      });
    }
  }, [error]);
  // if we have the updated password tag navigate back
  useEffect(() => {
    if (passwordTag) {
      setNewPassword(null);
      setScore(-1);

      navigate(`${SETTINGS_ROUTE}${SECURITY_ROUTE}`, {
        replace: true,
      });
    }
  }, [passwordTag]);

  return (
    <>
      <ConfirmPasswordModal
        isOpen={isOpen}
        onCancel={onClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
      />
      <PageHeader
        title={t<string>('titles.page', { context: 'changePassword' })}
      />
      <VStack
        flexGrow={1}
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={8}
        w="full"
      >
        <VStack flexGrow={1} spacing={4} w="full">
          <Text color={subTextColor} size="md" textAlign="left">
            {t<string>('captions.changePassword1')}
          </Text>
          <Text color={subTextColor} size="md" textAlign="left">
            {t<string>('captions.changePassword2')}
          </Text>
          <CreatePasswordInput
            disabled={saving}
            label={t<string>('labels.newPassword')}
            onChange={handlePasswordChange}
            score={score}
            value={newPassword || ''}
          />
        </VStack>
        <Button
          isLoading={saving}
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
