import { useDisclosure, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GoShieldLock } from 'react-icons/go';
import {
  IoKeyOutline,
  IoLockClosedOutline,
  IoPushOutline,
} from 'react-icons/io5';
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
  EXPORT_ACCOUNT_ROUTE,
  PASSKEY_ROUTE,
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

// errors
import { BaseExtensionError, MalformedDataError } from '@extension/errors';

// features
import {
  disableThunk as disableCredentialLockThunk,
  enableThunk as enableCredentialLockThunk,
} from '@extension/features/credential-lock';
import { create as createNotification } from '@extension/features/notifications';
import { saveSettingsToStorageThunk } from '@extension/features/settings';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectLogger,
  useSelectPasskeysEnabled,
  useSelectSettings,
} from '@extension/selectors';

// services
import PasskeyService from '@extension/services/PasskeyService';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  TEncryptionCredentials,
} from '@extension/types';
import { EncryptionMethodEnum } from '@extension/enums';

const SecuritySettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const logger = useSelectLogger();
  const passkeyEnabled = useSelectPasskeysEnabled();
  const settings = useSelectSettings();
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
    const _functionName = 'handleEnablePasswordLockSwitchChange';

    // if we are enabling, we need to get the credentials
    if (event.target.checked) {
      onAuthenticationModalOpen();

      return;
    }

    try {
      // wait for the settings to be updated
      await dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          security: {
            ...settings.security,
            enableCredentialLock: false,
          },
        })
      ).unwrap();
      // then... remove the decrypted private keys and remove and alarms
      await dispatch(disableCredentialLockThunk()).unwrap();
    } catch (error) {
      logger.error(`${SecuritySettingsPage.name}#${_functionName}:`, error);

      handleOnError(error);
    }
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';

    try {
      if (result.type === EncryptionMethodEnum.Unencrypted) {
        throw new MalformedDataError(
          'enabling credential lock requires encryption credentials'
        );
      }

      //  wait for the settings to be updated
      await dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          security: {
            ...settings.security,
            enableCredentialLock: true,
          },
        })
      ).unwrap();
      // then... decrypt the keys
      await dispatch(enableCredentialLockThunk(result)).unwrap();
    } catch (error) {
      logger.error(`${SecuritySettingsPage.name}#${_functionName}:`, error);

      handleOnError(error);
    }
  };
  const handleOnError = (error: BaseExtensionError) =>
    dispatch(
      createNotification({
        description: t<string>('errors.descriptions.code', {
          code: error.code,
          context: error.code,
        }),
        ephemeral: true,
        title: t<string>('errors.titles.code', { context: error.code }),
        type: 'error',
      })
    );
  const handlePasswordTimeoutDurationChange = ({ value }: IOption<number>) => {
    // update the settings
    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        security: {
          ...settings.security,
          credentialLockTimeoutDuration: value,
        },
      })
    );
  };

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        forceAuthentication={true}
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
      />

      <PageHeader title={t<string>('titles.page', { context: 'security' })} />

      <VStack w="full">
        {/*authentication*/}
        <SettingsSubHeading text={t<string>('headings.authentication')} />

        {/*enable password lock*/}
        <SettingsSwitchItem
          checked={settings.security.enableCredentialLock}
          description={t<string>('captions.enablePasswordLock')}
          label={t<string>('labels.enablePasswordLock')}
          onChange={handleEnablePasswordLockSwitchChange}
        />

        {/*password lock duration*/}
        <SettingsSelectItem
          disabled={!settings.security.enableCredentialLock}
          emptyOptionLabel={t<string>('placeholders.pleaseSelect')}
          label={t<string>('labels.passwordLockTimeout')}
          onChange={handlePasswordTimeoutDurationChange}
          options={durationOptions}
          value={
            durationOptions.find(
              (value) =>
                value.value === settings.security.credentialLockTimeoutDuration
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

        {/*passkey*/}
        <SettingsLinkItem
          badges={[
            ...(PasskeyService.isSupported()
              ? [
                  {
                    ...(passkeyEnabled
                      ? {
                          colorScheme: 'green',
                          label: t<string>('labels.enabled'),
                        }
                      : {
                          colorScheme: 'red',
                          label: t<string>('labels.disabled'),
                        }),
                  },
                ]
              : [
                  {
                    colorScheme: 'yellow',
                    label: t<string>('labels.notSupported'),
                  },
                ]),
            {
              colorScheme: 'blue',
              label: t<string>('labels.experimental'),
            },
          ]}
          icon={GoShieldLock}
          label={t<string>('titles.page', { context: 'passkey' })}
          to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}${PASSKEY_ROUTE}`}
        />

        {/*accounts*/}
        <SettingsSubHeading text={t<string>('headings.accounts')} />

        {/*view seed phrase*/}
        <SettingsLinkItem
          icon={IoKeyOutline}
          label={t<string>('titles.page', { context: 'viewSeedPhrase' })}
          to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}${VIEW_SEED_PHRASE_ROUTE}`}
        />

        {/*export account*/}
        <SettingsLinkItem
          icon={IoPushOutline}
          label={t<string>('titles.page', { context: 'exportAccount' })}
          to={`${SETTINGS_ROUTE}${SECURITY_ROUTE}${EXPORT_ACCOUNT_ROUTE}`}
        />
      </VStack>
    </>
  );
};

export default SecuritySettingsPage;
