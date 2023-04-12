import { Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Button from '@extension/components/Button';
import ConfirmPasswordModal from '@extension/components/ConfirmPasswordModal';
import CreatePasswordInput, {
  validate,
} from '@extension/components/CreatePasswordInput';
import PageHeader from '@extension/components/PageHeader';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Hooks
import useChangePassword from '@extension/hooks/useChangePassword';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const ChangePasswordPage: FC = () => {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { changePassword, saving } = useChangePassword();
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

    if (newPassword) {
      await changePassword(newPassword, currentPassword);
      setNewPassword(null);
      setScore(-1);
    }
  };

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
          colorScheme="primary"
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
