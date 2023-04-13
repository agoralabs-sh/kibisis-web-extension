import { Stack, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import Button from '@extension/components/Button';
import PageHeader from '@extension/components/PageHeader';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';

// Features
import { setConfirm } from '@extension/features/application';
import { sendResetThunk } from '@extension/features/messages';

// Types
import { IAppThunkDispatch } from '@extension/types';

const GeneralSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const handleClearAllDataClick = () =>
    dispatch(
      setConfirm({
        description: t<string>('captions.clearAllData'),
        onConfirm: () => dispatch(sendResetThunk()), // dispatch an event to the background
        title: t<string>('headings.clearAllData'),
        warningText: t<string>('captions.clearAllDataWarning'),
      })
    );

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'general' })} />
      <VStack w="full">
        {/* Danger zone */}
        <SettingsSubHeading
          color="red.500"
          text={t<string>('headings.dangerZone')}
        />
        <Stack
          alignItems="center"
          justifyContent="center"
          px={4}
          py={4}
          w="full"
        >
          <Button
            color="white"
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

export default GeneralSettingsPage;
