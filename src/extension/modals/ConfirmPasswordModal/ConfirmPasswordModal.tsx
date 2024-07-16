import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

// components
import Button from '@extension/components/Button';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectLogger,
  useSelectPasswordLockCredentials,
  useSelectSettings,
} from '@extension/selectors';

// services
import PasswordService from '@extension/services/PasswordService';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

const ConfirmPasswordModal: FC<IProps> = ({
  isOpen,
  hint,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  // selectors
  const logger = useSelectLogger();
  const passwordLockCredentials = useSelectPasswordLockCredentials();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
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

    onConfirm(password);
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
    // show a loader if there is a password lock and password
    if (settings.security.enablePasswordLock && passwordLockCredentials) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*loader*/}
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={defaultTextColor}
            color={defaultTextColor}
            size="lg"
          />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
            {t<string>('captions.checkingAuthenticationCredentials')}
          </Text>
        </VStack>
      );
    }

    return (
      <VStack w="full">
        <PasswordInput
          disabled={verifying}
          error={passwordError}
          hint={hint || t<string>('captions.mustEnterPasswordToConfirm')}
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
  // check if there is a password lock and password lock password present
  useEffect(() => {
    if (
      settings.security.enablePasswordLock &&
      passwordLockCredentials?.type === EncryptionMethodEnum.Password
    ) {
      onConfirm(passwordLockCredentials.password);
      handleClose();
    }
  }, [isOpen]);

  return (
    <Modal
      initialFocusRef={passwordInputRef}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
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
      </ModalContent>
    </Modal>
  );
};

export default ConfirmPasswordModal;
