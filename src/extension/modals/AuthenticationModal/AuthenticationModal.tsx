import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLockClosedOutline } from 'react-icons/io5';
import { Radio } from 'react-loader-spinner';
import browser from 'webextension-polyfill';

// components
import Button from '@extension/components/Button';
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';
import PasswordInput from '@extension/components/PasswordInput';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import {
  CredentialLockActivationStateEnum,
  EncryptionMethodEnum,
} from '@extension/enums';

// hooks
import { usePassword } from '@extension/components/PasswordInput';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectCredentialLockActivated,
  useSelectLogger,
  useSelectPasskeysPasskey,
  useSelectSettingsCredentialLockEnabled,
} from '@extension/selectors';

// services
import PasskeyService from '@extension/services/PasskeyService';
import PasswordService from '@extension/services/PasswordService';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

const AuthenticationModal: FC<IProps> = ({
  forceAuthentication = false,
  isOpen,
  onClose,
  onConfirm,
  onError,
  passwordHint,
}) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  // selectors
  const credentialLockActivated = useSelectCredentialLockActivated();
  const logger = useSelectLogger();
  const passkey = useSelectPasskeysPasskey();
  const credentialLockEnabled = useSelectSettingsCredentialLockEnabled();
  // hooks
  const primaryColorCode = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const subTextColor = useSubTextColor();
  // states
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const reset = () => {
    resetPassword();
    setVerifying(false);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleConfirmClick = async () => {
    let isValid: boolean;
    let passwordService: PasswordService;

    // check if the input is valid
    if (validatePassword()) {
      return;
    }

    passwordService = new PasswordService({
      logger,
      passwordTag: browser.runtime.id,
    });

    setVerifying(true);

    isValid = await passwordService.verifyPassword(password);

    setVerifying(false);

    if (!isValid) {
      setPasswordError(t<string>('errors.inputs.invalidPassword'));

      return;
    }

    onConfirm({
      password,
      type: EncryptionMethodEnum.Password,
    });

    handleClose();
  };
  const handleClose = () => {
    onClose && onClose();

    reset(); // clean up
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleConfirmClick();
    }
  };
  // renders
  const renderContent = () => {
    // if the credential lock is enabled and in active, show a loader
    if (
      !forceAuthentication &&
      credentialLockEnabled &&
      credentialLockActivated === CredentialLockActivationStateEnum.Inactive
    ) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*progress*/}
          <CircularProgressWithIcon icon={IoLockClosedOutline} />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
            {t<string>('captions.checkingAuthenticationCredentials')}
          </Text>
        </VStack>
      );
    }

    // show a loader for passkeys
    if (passkey) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*passkey loader*/}
          <Radio
            colors={[primaryColorCode, primaryColorCode, primaryColorCode]}
            height="80"
            width="80"
          />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
            {t<string>('captions.requestingPasskeyPermission', {
              name: passkey.name,
            })}
          </Text>
        </VStack>
      );
    }

    return (
      <VStack w="full">
        <PasswordInput
          disabled={verifying}
          error={passwordError}
          hint={
            passwordHint || t<string>('captions.mustEnterPasswordToConfirm')
          }
          inputRef={passwordInputRef}
          onChange={onPasswordChange}
          onKeyUp={handleKeyUpPasswordInput}
          value={password || ''}
        />
      </VStack>
    );
  };

  // set focus when opening
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    (async () => {
      let inputKeyMaterial: Uint8Array;

      if (!isOpen) {
        return;
      }

      // if the credentials lock is enabled and not activated use the unencrypted keys
      if (
        !forceAuthentication &&
        credentialLockEnabled &&
        credentialLockActivated === CredentialLockActivationStateEnum.Inactive
      ) {
        onConfirm({
          type: EncryptionMethodEnum.Unencrypted,
        });

        return handleClose();
      }

      // if there is a passkey, attempt to fetch the passkey input key material
      if (passkey) {
        try {
          // fetch the encryption key material
          inputKeyMaterial =
            await PasskeyService.fetchInputKeyMaterialFromPasskey({
              credential: passkey,
              logger,
            });

          onConfirm({
            inputKeyMaterial,
            type: EncryptionMethodEnum.Passkey,
          });

          return handleClose();
        } catch (error) {
          logger.error(`${AuthenticationModal.name}#useEffect:`, error);

          return onError && onError(error);
        }
      }
    })();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
      {...(!passkey && {
        initialFocusRef: passwordInputRef,
      })}
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH={0}
      >
        {/*content*/}
        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        {/*footer*/}
        {!passkey && (
          <ModalFooter p={DEFAULT_GAP}>
            <HStack spacing={DEFAULT_GAP - 2} w="full">
              <Button
                onClick={handleCancelClick}
                size="lg"
                variant="outline"
                w="full"
              >
                {t<string>('buttons.cancel')}
              </Button>

              <Button
                isLoading={verifying}
                onClick={handleConfirmClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.confirm')}
              </Button>
            </HStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AuthenticationModal;
