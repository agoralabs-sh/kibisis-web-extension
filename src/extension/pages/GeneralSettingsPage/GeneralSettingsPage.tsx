import { VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsButtonItem from '@extension/components/SettingsButtonItem';
import SettingsSelectItem, {
  IOption,
} from '@extension/components/SettingsSelectItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';

// features
import { sendFactoryResetThunk } from '@extension/features/messages';
import { saveSettingsToStorageThunk } from '@extension/features/settings';
import { setConfirmModal } from '@extension/features/system';

// selectors
import {
  useSelectSelectedNetwork,
  useSelectSettings,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSettingsPreferredNFTExplorer,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IBlockExplorer,
  INetwork,
  INFTExplorer,
  ISettings,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const GeneralSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const preferredBlockExplorer: IBlockExplorer | null =
    useSelectSettingsPreferredBlockExplorer();
  const preferredNFTExplorer: INFTExplorer | null =
    useSelectSettingsPreferredNFTExplorer();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const settings: ISettings = useSelectSettings();
  // misc
  const blockExplorerOptions: IOption<string>[] =
    selectedNetwork?.blockExplorers.map((value) => ({
      label: value.canonicalName,
      value: value.id,
    })) || [];
  const nftExplorerOptions: IOption<string>[] =
    selectedNetwork?.nftExplorers.map((value) => ({
      label: value.canonicalName,
      value: value.id,
    })) || [];
  // handlers
  const handleClearAllDataClick = () =>
    dispatch(
      setConfirmModal({
        description: t<string>('captions.factoryResetModal'),
        onConfirm: () => dispatch(sendFactoryResetThunk()), // dispatch an event to the background
        title: t<string>('headings.factoryReset'),
        warningText: t<string>('captions.factoryResetWarning'),
      })
    );
  const handlePreferredBlockExplorerChange = (option: IOption<string>) => {
    let explorer: IBlockExplorer | null;

    if (selectedNetwork) {
      explorer =
        selectedNetwork.blockExplorers.find(
          (value) => value.id === option.value
        ) || null;

      if (explorer) {
        dispatch(
          saveSettingsToStorageThunk({
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
  const handlePreferredNFTExplorerChange = (option: IOption<string>) => {
    let explorer: INFTExplorer | null;

    if (selectedNetwork) {
      explorer =
        selectedNetwork.nftExplorers.find(
          (value) => value.id === option.value
        ) || null;

      if (explorer) {
        dispatch(
          saveSettingsToStorageThunk({
            ...settings,
            general: {
              ...settings.general,
              preferredNFTExplorerIds: {
                ...settings.general.preferredNFTExplorerIds,
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
          <SettingsSelectItem
            description={t<string>('captions.preferredBlockExplorer')}
            emptyOptionLabel={t<string>('captions.noBlockExplorersAvailable')}
            label={t<string>('labels.preferredBlockExplorer')}
            onChange={handlePreferredBlockExplorerChange}
            options={blockExplorerOptions}
            value={
              blockExplorerOptions.find(
                (value) => value.value === preferredBlockExplorer?.id
              ) || blockExplorerOptions[0]
            }
          />

          {/* preferred nft explorer */}
          <SettingsSelectItem
            description={t<string>('captions.preferredNFTExplorer')}
            emptyOptionLabel={t<string>('captions.noNFTExplorersAvailable')}
            label={t<string>('labels.preferredNFTExplorer')}
            onChange={handlePreferredNFTExplorerChange}
            options={nftExplorerOptions}
            value={
              nftExplorerOptions.find(
                (value) => value.value === preferredNFTExplorer?.id
              ) || nftExplorerOptions[0]
            }
          />
        </VStack>

        {/* danger zone */}
        <VStack w="full">
          <SettingsSubHeading
            color="red.500"
            text={t<string>('headings.dangerZone')}
          />

          {/*factory reset button*/}
          <SettingsButtonItem
            buttonLabel={t<string>('buttons.reset')}
            description={t<string>('captions.factoryReset')}
            isWarning={true}
            label={t<string>('labels.factoryReset')}
            onClick={handleClearAllDataClick}
          />
        </VStack>
      </VStack>
    </>
  );
};

export default GeneralSettingsPage;
