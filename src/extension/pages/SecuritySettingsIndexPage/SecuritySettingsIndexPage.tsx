import { VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLockClosedOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsLinkItem from '@extension/components/SettingsLinkItem';
import SettingsSelectItem, {
  IOption,
} from '@extension/components/SettingsSelectItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';
import SettingsSwitchItem from '@extension/components/SettingsSwitchItem';

// constants
import {
  CHANGE_PASSWORD_ROUTE,
  PASSWORD_DURATION_HIGH,
  PASSWORD_DURATION_HIGHER,
  PASSWORD_DURATION_HIGHEST,
  PASSWORD_DURATION_LOW,
  PASSWORD_DURATION_LOWEST,
  PASSWORD_DURATION_NORMAL,
  SECURITY_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

// features
import { saveSettingsToStorageThunk } from '@extension/features/settings';

// selectors
import { useSelectSettings } from '@extension/selectors';

// types
import { IAppThunkDispatch, ISettings } from '@extension/types';

const SecuritySettingsIndexPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const settings: ISettings = useSelectSettings();
  // misc
  const durationOptions: IOption<number>[] = [
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_DURATION_LOWEST,
      }),
      value: PASSWORD_DURATION_LOWEST,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_DURATION_LOW,
      }),
      value: PASSWORD_DURATION_LOW,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_DURATION_NORMAL,
      }),
      value: PASSWORD_DURATION_NORMAL,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_DURATION_HIGH,
      }),
      value: PASSWORD_DURATION_HIGH,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_DURATION_HIGHER,
      }),
      value: PASSWORD_DURATION_HIGHER,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_DURATION_HIGHEST,
      }),
      value: PASSWORD_DURATION_HIGHEST,
    },
    {
      label: t<string>('labels.passwordLockDuration'), // never
      value: 0,
    },
  ];
  // handlers
  const handleEnablePasswordLockSwitchChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        security: {
          ...settings.security,
          enablePasswordLock: event.target.checked,
        },
      })
    );
  };
  const handlePasswordTimeoutDurationChange = (option: IOption<number>) => {
    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        security: {
          ...settings.security,
          passwordLockTimeoutDuration: option.value,
        },
      })
    );
  };

  return (
    <>
      <PageHeader title={t<string>('titles.page', { context: 'security' })} />
      <VStack w="full">
        {/*authentication*/}
        <SettingsSubHeading text={t<string>('headings.authentication')} />

        {/*enable password lock*/}
        <SettingsSwitchItem
          checked={settings.security.enablePasswordLock}
          description={t<string>('captions.enablePasswordLock')}
          label={t<string>('labels.enablePasswordLock')}
          onChange={handleEnablePasswordLockSwitchChange}
        />

        <SettingsSelectItem
          disabled={!settings.security.enablePasswordLock}
          emptyOptionLabel={t<string>('placeholders.pleaseSelect')}
          label={t<string>('labels.passwordLockTimeout')}
          onChange={handlePasswordTimeoutDurationChange}
          options={durationOptions}
          value={
            durationOptions.find(
              (value) =>
                value.value === settings.security.passwordLockTimeoutDuration
            ) || {
              label: t<string>('labels.passwordLockDuration', {
                context: PASSWORD_DURATION_NORMAL,
              }),
              value: PASSWORD_DURATION_NORMAL,
            }
          }
        />

        {/*change password*/}
        <SettingsLinkItem
          icon={IoLockClosedOutline}
          label={t<string>('titles.page', { context: 'changePassword' })}
          to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}${CHANGE_PASSWORD_ROUTE}`}
        />
      </VStack>
    </>
  );
};

export default SecuritySettingsIndexPage;
