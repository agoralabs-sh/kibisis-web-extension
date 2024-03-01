import { useDisclosure, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoKeyOutline, IoLockClosedOutline } from 'react-icons/io5';
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
  PASSWORD_LOCK_DURATION_HIGH,
  PASSWORD_LOCK_DURATION_HIGHER,
  PASSWORD_LOCK_DURATION_HIGHEST,
  PASSWORD_LOCK_DURATION_LOW,
  PASSWORD_LOCK_DURATION_LOWEST,
  PASSWORD_LOCK_DURATION_NORMAL,
  SECURITY_ROUTE,
  SETTINGS_ROUTE,
  VIEW_SEED_PHRASE_ROUTE,
} from '@extension/constants';

// features
import { savePasswordLockThunk } from '@extension/features/password-lock';
import { saveSettingsToStorageThunk } from '@extension/features/settings';

// modals
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';

// selectors
import { useSelectLogger, useSelectSettings } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type { IAppThunkDispatch, ISettings } from '@extension/types';

const SecuritySettingsIndexPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isPasswordConfirmModalOpen,
    onClose: onPasswordConfirmModalClose,
    onOpen: onPasswordConfirmModalOpen,
  } = useDisclosure();
  // selectors
  const logger: ILogger = useSelectLogger();
  const settings: ISettings = useSelectSettings();
  // misc
  const durationOptions: IOption<number>[] = [
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_LOCK_DURATION_LOWEST,
      }),
      value: PASSWORD_LOCK_DURATION_LOWEST,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_LOCK_DURATION_LOW,
      }),
      value: PASSWORD_LOCK_DURATION_LOW,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_LOCK_DURATION_NORMAL,
      }),
      value: PASSWORD_LOCK_DURATION_NORMAL,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_LOCK_DURATION_HIGH,
      }),
      value: PASSWORD_LOCK_DURATION_HIGH,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_LOCK_DURATION_HIGHER,
      }),
      value: PASSWORD_LOCK_DURATION_HIGHER,
    },
    {
      label: t<string>('labels.passwordLockDuration', {
        context: PASSWORD_LOCK_DURATION_HIGHEST,
      }),
      value: PASSWORD_LOCK_DURATION_HIGHEST,
    },
    {
      label: t<string>('labels.passwordLockDuration'), // never
      value: 0,
    },
  ];
  // handlers
  const handleEnablePasswordLockSwitchChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const _functionName: string = 'handleEnablePasswordLockSwitchChange';

    // if we are enabling, we need to set the password
    if (event.target.checked) {
      onPasswordConfirmModalOpen();

      return;
    }

    try {
      // disable the password lock and wait for the settings to be updated
      await dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          security: {
            ...settings.security,
            enablePasswordLock: false,
          },
        })
      ).unwrap();

      // ...then remove the password from the password lock
      dispatch(savePasswordLockThunk(null));
    } catch (error) {
      logger.debug(
        `${SecuritySettingsIndexPage.name}#${_functionName}: failed save settings`
      );
    }
  };
  const handleOnConfirmPasswordModalConfirm = async (password: string) => {
    const _functionName: string = 'handleOnConfirmPasswordModalConfirm';

    onPasswordConfirmModalClose();

    try {
      // enable the lock and wait for the settings to be updated
      await dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          security: {
            ...settings.security,
            enablePasswordLock: true,
          },
        })
      ).unwrap();

      // then... save the new password to the password lock
      dispatch(savePasswordLockThunk(password));
    } catch (error) {
      logger.debug(
        `${SecuritySettingsIndexPage.name}#${_functionName}: failed save settings`
      );
    }
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
      <ConfirmPasswordModal
        isOpen={isPasswordConfirmModalOpen}
        onCancel={onPasswordConfirmModalClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
      />

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

        {/*password lock duration*/}
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
                context: PASSWORD_LOCK_DURATION_NORMAL,
              }),
              value: PASSWORD_LOCK_DURATION_NORMAL,
            }
          }
        />

        {/*change password*/}
        <SettingsLinkItem
          icon={IoLockClosedOutline}
          label={t<string>('titles.page', { context: 'changePassword' })}
          to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}${CHANGE_PASSWORD_ROUTE}`}
        />

        {/*view seed phrase*/}
        <SettingsLinkItem
          icon={IoKeyOutline}
          label={t<string>('titles.page', { context: 'viewSeedPhrase' })}
          to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}${VIEW_SEED_PHRASE_ROUTE}`}
        />
      </VStack>
    </>
  );
};

export default SecuritySettingsIndexPage;
