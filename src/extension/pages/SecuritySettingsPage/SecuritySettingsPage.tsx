import { Stack, useDisclosure, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import Button from '@extension/components/Button';
import ConfirmModal from '@extension/components/ConfirmModal';
import SettingsHeader from '@extension/components/SettingsHeader';

// Features
import { sendResetThunk } from '@extension/features/messages';

// Types
import { IAppThunkDispatch } from '@extension/types';

const SecuritySettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const handleConfirmClearAllData = () => {
    onClose();

    // dispatch an event to the background
    dispatch(sendResetThunk());
  };
  const handleClearAllDataClick = () => onOpen();

  return (
    <>
      <ConfirmModal
        description={t<string>('captions.clearAllData')}
        isOpen={isOpen}
        onCancel={onClose}
        onConfirm={handleConfirmClearAllData}
        title={t<string>('headings.clearAllData')}
        warningText={t<string>('captions.clearAllDataWarning')}
      />
      <SettingsHeader
        title={t<string>('titles.page', { context: 'security' })}
      />
      <VStack w="full">
        {/* Clear data */}
        <Stack
          alignItems="center"
          justifyContent="center"
          px={4}
          py={4}
          w="full"
        >
          <Button
            colorScheme="red"
            maxW={400}
            onClick={handleClearAllDataClick}
          >
            {t<string>('buttons.clearAllData')}
          </Button>
        </Stack>
      </VStack>
    </>
  );
};

export default SecuritySettingsPage;
