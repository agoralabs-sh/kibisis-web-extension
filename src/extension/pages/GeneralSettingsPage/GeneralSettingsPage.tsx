import { VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoGlobeOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsButtonItem from '@extension/components/SettingsButtonItem';
import SettingsLinkItem from '@extension/components/SettingsLinkItem';
import SettingsSelectItem from '@extension/components/SettingsSelectItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';

// constants
import {
  CUSTOM_NETWORKS_ROUTE,
  DEFAULT_GAP,
  GENERAL_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

// features
import { setConfirmModal } from '@extension/features/layout';
import { sendFactoryResetThunk } from '@extension/features/messages';
import { saveSettingsToStorageThunk } from '@extension/features/settings';

// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';
import BaseNFTExplorer from '@extension/models/BaseNFTExplorer';

// selectors
import {
  useSelectSelectedNetwork,
  useSelectSettings,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSettingsPreferredNFTExplorer,
} from '@extension/selectors';

// types
import type { IOption } from '@extension/components/SettingsSelectItem';
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const GeneralSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const network = useSelectSelectedNetwork();
  const preferredBlockExplorer = useSelectSettingsPreferredBlockExplorer();
  const preferredNFTExplorer = useSelectSettingsPreferredNFTExplorer();
  const settings = useSelectSettings();
  // misc
  const blockExplorerOptions: IOption<string>[] =
    network?.blockExplorers.map((value) => ({
      label: value.canonicalName,
      value: value.id,
    })) || [];
  const nftExplorerOptions: IOption<string>[] =
    network?.nftExplorers.map((value) => ({
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
    let explorer: BaseBlockExplorer | null;

    if (network) {
      explorer =
        network.blockExplorers.find((value) => value.id === option.value) ||
        null;

      if (explorer) {
        dispatch(
          saveSettingsToStorageThunk({
            ...settings,
            general: {
              ...settings.general,
              preferredBlockExplorerIds: {
                ...settings.general.preferredBlockExplorerIds,
                [convertGenesisHashToHex(network.genesisHash).toUpperCase()]:
                  explorer.id,
              },
            },
          })
        );
      }
    }
  };
  const handlePreferredNFTExplorerChange = (option: IOption<string>) => {
    let explorer: BaseNFTExplorer | null;

    if (network) {
      explorer =
        network.nftExplorers.find((value) => value.id === option.value) || null;

      if (explorer) {
        dispatch(
          saveSettingsToStorageThunk({
            ...settings,
            general: {
              ...settings.general,
              preferredNFTExplorerIds: {
                ...settings.general.preferredNFTExplorerIds,
                [convertGenesisHashToHex(network.genesisHash).toUpperCase()]:
                  explorer.id,
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
      <VStack spacing={DEFAULT_GAP - 2} w="full">
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

          {/*custom networks*/}
          <SettingsLinkItem
            icon={IoGlobeOutline}
            label={t<string>('titles.page', { context: 'customNetworks' })}
            to={`${SETTINGS_ROUTE}${GENERAL_ROUTE}${CUSTOM_NETWORKS_ROUTE}`}
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
