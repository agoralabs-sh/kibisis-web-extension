import { Stack, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import PageHeader from '@extension/components/PageHeader';
import SettingsSelectItem from '@extension/components/SettingsSelectItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';

// features
import { setConfirm } from '@extension/features/system';
import { sendFactoryResetThunk } from '@extension/features/messages';
import { saveSettingsToStorage } from '@extension/features/settings';

// selectors
import {
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// types
import {
  IAppThunkDispatch,
  IExplorer,
  INetwork,
  ISettings,
} from '@extension/types';
import { convertGenesisHashToHex } from '@extension/utils';

const GeneralSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const settings: ISettings = useSelectSettings();
  const handleClearAllDataClick = () =>
    dispatch(
      setConfirm({
        description: t<string>('captions.clearAllData'),
        onConfirm: () => dispatch(sendFactoryResetThunk()), // dispatch an event to the background
        title: t<string>('headings.clearAllData'),
        warningText: t<string>('captions.clearAllDataWarning'),
      })
    );
  const handlePreferredBlockExplorerChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    let explorer: IExplorer | null;

    if (selectedNetwork) {
      explorer =
        selectedNetwork?.explorers.find(
          (value) => value.id === event.target.value
        ) || null;

      if (explorer) {
        dispatch(
          saveSettingsToStorage({
            ...settings,
            general: {
              ...settings.general,
              preferredBlockExplorerIds: {
                ...settings.general.preferredBlockExplorerIds,
                [convertGenesisHashToHex(
                  selectedNetwork.genesisHash
                ).toUpperCase()]: explorer.id,
              },
            },
          })
        );
      }
    }
  };

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'general' })} />
      <VStack spacing={4} w="full">
        {/* network */}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.network')} />

          {/* preferred block explorer */}
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
                settings.general.preferredBlockExplorerIds[
                  convertGenesisHashToHex(
                    selectedNetwork.genesisHash
                  ).toUpperCase()
                ] || selectedNetwork.explorers[0].id
              }
            />
          )}
        </VStack>

        {/* danger zone */}
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
            {/* clear all data */}
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
