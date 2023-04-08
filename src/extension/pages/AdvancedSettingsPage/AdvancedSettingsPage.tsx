import { Text, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import SettingsHeader from '@extension/components/SettingsHeader';
import SettingsSwitchItem from '@extension/components/SettingsSwitchItem';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Features
import { setSettings } from '@extension/features/settings';

// Hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import { useSelectSettings } from '@extension/selectors';

// Types
import {
  IAdvancedSettings,
  IAppThunkDispatch,
  ISettings,
} from '@extension/types';

const AdvancedSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const subTextColor: string = useSubTextColor();
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
        {/* Developer */}
        <Text
          color={subTextColor}
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
        {/* Beta */}
        <Text
          color={subTextColor}
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
        <SettingsSwitchItem
          checked={settings.advanced.allowDidTokenFormat}
          description={t<string>('captions.allowDidTokenFormat')}
          label={t<string>('labels.allowDidTokenFormat')}
          onChange={handleOnSwitchChange('allowDidTokenFormat')}
        />
      </VStack>
    </>
  );
};

export default AdvancedSettingsPage;
