import { VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';
import SettingsSwitchItem from '@extension/components/SettingsSwitchItem';

// features
import { setSettings } from '@extension/features/settings';

// selectors
import { useSelectSettings } from '@extension/selectors';

// types
import {
  IAdvancedSettings,
  IAppThunkDispatch,
  ISettings,
} from '@extension/types';

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
      <PageHeader title={t<string>('titles.page', { context: 'advanced' })} />
      <VStack spacing={4} w="full">
        {/* Developer */}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.developer')} />
          <SettingsSwitchItem
            checked={settings.advanced.allowTestNet}
            description={t<string>('captions.allowTestNet')}
            label={t<string>('labels.allowTestNet')}
            onChange={handleOnSwitchChange('allowTestNet')}
          />
        </VStack>

        {/* Beta */}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.beta')} />
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
      </VStack>
    </>
  );
};

export default AdvancedSettingsPage;
