import { Stack, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import PageHeader from '@extension/components/PageHeader';
import SettingsSelectItem, {
  IOption,
} from '@extension/components/SettingsSelectItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';

// features
import { sendFactoryResetThunk } from '@extension/features/messages';
import { saveSettingsToStorage } from '@extension/features/settings';
import { setConfirm } from '@extension/features/system';

// selectors
import {
  useSelectPreferredBlockExplorer,
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
import { DEFAULT_GAP } from '@extension/constants';

const GeneralSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const preferredBlockExplorer: IExplorer | null =
    useSelectPreferredBlockExplorer();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const settings: ISettings = useSelectSettings();
  // misc
  const blockExplorerOptions: IOption<string>[] =
    selectedNetwork?.explorers.map((value) => ({
      label: value.canonicalName,
      value: value.id,
    })) || [];
  // handlers
  const handleClearAllDataClick = () =>
    dispatch(
      setConfirm({
        description: t<string>('captions.clearAllData'),
        onConfirm: () => dispatch(sendFactoryResetThunk()), // dispatch an event to the background
        title: t<string>('headings.clearAllData'),
        warningText: t<string>('captions.clearAllDataWarning'),
      })
    );
  const handlePreferredBlockExplorerChange = (option: IOption<string>) => {
    let explorer: IExplorer | null;

    if (selectedNetwork) {
      explorer =
        selectedNetwork.explorers.find((value) => value.id === option.value) ||
        null;

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
      {/*header*/}
      <PageHeader title={t<string>('titles.page', { context: 'general' })} />

      {/*content*/}
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
              options={blockExplorerOptions}
              value={
                blockExplorerOptions.find(
                  (value) => value.value === preferredBlockExplorer?.id
                ) || blockExplorerOptions[0]
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
            px={DEFAULT_GAP / 2}
            py={DEFAULT_GAP / 2}
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
