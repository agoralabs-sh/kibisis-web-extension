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
import React, {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoCheckmarkOutline,
  IoLockClosedOutline,
  IoWifiOutline,
} from 'react-icons/io5';
import browser from 'webextension-polyfill';

// components
import Button from '@extension/components/Button';
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';
import PasswordInput from '@extension/components/PasswordInput';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useGenericInput from '@extension/hooks/useGenericInput';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectIsCredentialsRequired,
  useSelectLogger,
  useSelectPasskeysPasskey,
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
  const isCredentialsRequired = useSelectIsCredentialsRequired();
  const logger = useSelectLogger();
  const passkey = useSelectPasskeysPasskey();
  // hooks
  const primaryColorCode = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const {
    error: passwordError,
    label: passwordLabel,
    required: isPasswordRequired,
    reset: resetPassword,
    setError: setPasswordError,
    setValue: setPasswordValue,
    validate: validatePassword,
    value: passwordValue,
  } = useGenericInput({
    required: true,
    label: t<string>('labels.password'),
  });
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
    if (!!passwordError || !!validatePassword(passwordValue)) {
      return;
    }

    passwordService = new PasswordService({
      logger,
      passwordTag: browser.runtime.id,
    });

    setVerifying(true);

    isValid = await passwordService.verifyPassword(passwordValue);

    setVerifying(false);

    if (!isValid) {
      setPasswordError(t<string>('errors.inputs.invalidPassword'));

      return;
    }

    onConfirm({
      password: passwordValue,
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
  const handleOnPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    validatePassword(event.target.value);
    setPasswordValue(event.target.value);
  };
  // renders
  const renderContent = () => {
    // if the credential lock is not active, show a loader
    if (!forceAuthentication && !isCredentialsRequired) {
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
          <CircularProgressWithIcon icon={IoWifiOutline} />

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
          label={passwordLabel}
          onChange={handleOnPasswordChange}
          onKeyUp={handleKeyUpPasswordInput}
          required={isPasswordRequired}
          value={passwordValue || ''}
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

      // if we are not forcing authentication and if the credentials are not required, use the unencrypted keys
      if (!forceAuthentication && !isCredentialsRequired) {
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
            passkey,
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
                rightIcon={<IoCheckmarkOutline />}
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
