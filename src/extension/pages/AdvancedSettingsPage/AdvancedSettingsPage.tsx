import { VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';
import SettingsSwitchItem from '@extension/components/SettingsSwitchItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { setSettings } from '@extension/features/settings';
import { setConfirm } from '@extension/features/system';

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
  // selectors
  const settings: ISettings = useSelectSettings();
  // handlers
  const handleMainNetSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    // if the switch is being enabled, get the user to confirmation
    if (event.target.checked) {
      dispatch(
        setConfirm({
          description: t<string>('captions.allowMainNetConfirm'),
          onConfirm: () =>
            dispatch(
              setSettings({
                ...settings,
                advanced: {
                  ...settings.advanced,
                  allowMainNet: event.target.checked,
                },
              })
            ),
          title: t<string>('headings.allowMainNetConfirm'),
          warningText: t<string>('captions.allowMainNetWarning'),
        })
      );

      return;
    }

    dispatch(
      setSettings({
        ...settings,
        advanced: {
          ...settings.advanced,
          allowMainNet: event.target.checked,
        },
      })
    );
  };
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
      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/* beta */}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.beta')} />

          <SettingsSwitchItem
            checked={settings.advanced.allowMainNet}
            description={t<string>('captions.allowMainNet')}
            label={t<string>('labels.allowMainNet')}
            onChange={handleMainNetSwitchChange}
          />

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
