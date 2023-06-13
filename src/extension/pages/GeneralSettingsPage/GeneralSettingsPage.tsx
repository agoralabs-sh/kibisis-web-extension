import { Stack, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import Button from '@extension/components/Button';
import PageHeader from '@extension/components/PageHeader';
import SettingsSelectItem from '@extension/components/SettingsSelectItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';

// Features
import { setConfirm } from '@extension/features/system';
import { sendResetThunk } from '@extension/features/messages';
import { setSettings } from '@extension/features/settings';

// Selectors
import {
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// Types
import {
  IAppThunkDispatch,
  IExplorer,
  INetwork,
  ISettings,
} from '@extension/types';

const GeneralSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const settings: ISettings = useSelectSettings();
  const handleClearAllDataClick = () =>
    dispatch(
      setConfirm({
        description: t<string>('captions.clearAllData'),
        onConfirm: () => dispatch(sendResetThunk()), // dispatch an event to the background
        title: t<string>('headings.clearAllData'),
        warningText: t<string>('captions.clearAllDataWarning'),
      })
    );
  const handlePreferredBlockExplorerChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const explorer: IExplorer | null =
      selectedNetwork?.explorers.find(
        (value) => value.id === event.target.value
      ) || null;

    if (explorer) {
      dispatch(
        setSettings({
          ...settings,
          general: {
            ...settings.general,
            preferredBlockExplorerId: explorer.id,
          },
        })
      );
    }
  };

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'general' })} />
      <VStack spacing={4} w="full">
        {/*Network*/}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.network')} />

          {/*Preferred block explorer*/}
          {selectedNetwork && selectedNetwork.explorers.length > 0 && (
            <SettingsSelectItem
              description={t<string>('captions.preferredBlockExplorer')}
              label={t<string>('labels.preferredBlockExplorer')}
              onChange={handlePreferredBlockExplorerChange}
              options={selectedNetwork.explorers.map((value) => ({
                label: value.canonicalName,
                value: value.id,
              }))}
              value={
                settings.general.preferredBlockExplorerId ||
                selectedNetwork.explorers[0].id
              }
            />
          )}
        </VStack>

        {/*Danger zone*/}
        <VStack w="full">
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
            {/*Clear all data*/}
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
      </VStack>
    </>
  );
};

export default GeneralSettingsPage;
