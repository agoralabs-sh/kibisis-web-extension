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
import { setConfirm } from '@extension/features/system';
import { ellipseAddress } from '@extension/utils';
import { AccountService } from '@extension/services';
import { removeAccountByIdThunk } from '@extension/features/accounts';

const AdvancedSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const settings: ISettings = useSelectSettings();
  // handlers
  const handleMainNetSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    // if the switch is being enabled, get the user to confirmation
    if (event.target.checked) {
      console.log('confirm?');
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
      <VStack spacing={4} w="full">
        {/* developer */}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.developer')} />
          <SettingsSwitchItem
            checked={settings.advanced.allowMainNet}
            description={t<string>('captions.allowMainNet')}
            label={t<string>('labels.allowMainNet')}
            onChange={handleMainNetSwitchChange}
          />
        </VStack>

        {/* beta */}
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
