import { Text, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import SettingsHeader from '../../components/SettingsHeader';
import SettingsSwitchItem from '../../components/SettingsSwitchItem';

// Constants
import { DEFAULT_GAP } from '../../constants';

// Features
import { setSettings } from '../../features/settings';

// Selectors
import { useSelectSettings } from '../../selectors';

// Types
import { IAdvancedSettings, IAppThunkDispatch, ISettings } from '../../types';

const AdvancedSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const settings: ISettings = useSelectSettings();
  const handleOnSwitchChange =
    (key: keyof IAdvancedSettings) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        setSettings({
          ...settings,
          advanced: {
            ...settings.advanced,
            [key]: event.target.checked,
          },
        })
      );
    };

  return (
    <>
      <SettingsHeader
        title={t<string>('titles.page', { context: 'advanced' })}
      />
      <VStack w="full">
        <Text
          color="gray.500"
          fontSize="sm"
          px={DEFAULT_GAP - 2}
          textAlign="left"
          w="full"
        >
          {t<string>('headings.developer')}
        </Text>
        <SettingsSwitchItem
          checked={settings.advanced.allowTestNet}
          description={t<string>('captions.allowTestNet')}
          label={t<string>('labels.allowTestNet')}
          onChange={handleOnSwitchChange('allowTestNet')}
        />
        <Text
          color="gray.500"
          fontSize="sm"
          px={DEFAULT_GAP - 2}
          textAlign="left"
          w="full"
        >
          {t<string>('headings.beta')}
        </Text>
        <SettingsSwitchItem
          checked={settings.advanced.allowBetaNet}
          description={t<string>('captions.allowBetaNet')}
          label={t<string>('labels.allowBetaNet')}
          onChange={handleOnSwitchChange('allowBetaNet')}
        />
      </VStack>
    </>
  );
};

export default AdvancedSettingsPage;
