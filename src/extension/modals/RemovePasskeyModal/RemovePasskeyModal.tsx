import {
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, KeyboardEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GoShieldSlash } from 'react-icons/go';
import { Radio } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import ReEncryptKeysLoadingContent from '@extension/components/ReEncryptKeysLoadingContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useRemovePasskey from './hooks/useRemovePasskey';

// selectors
import {
  useSelectLogger,
  useSelectPasskeysSaving,
  useSelectSystemInfo,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch } from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const RemovePasskeyModal: FC<IProps> = ({ onClose, removePasskey }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  // selectors
  const logger = useSelectLogger();
  const saving = useSelectPasskeysSaving();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const {
    encrypting,
    encryptionProgressState,
    error,
    removePasskeyAction,
    requesting,
    resetAction: resetRemovePasskeyAction,
  } = useRemovePasskey();
  const defaultTextColor = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const primaryColorCode = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const subTextColor = useSubTextColor();
  // misc
  const isLoading = encrypting || requesting || saving;
  // handlers
  const handleCancelClick = async () => handleClose();
  const handleClose = () => {
    resetPassword();
    resetRemovePasskeyAction();

    if (onClose) {
      onClose();
    }
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleRemoveClick();
    }
  };
  const handleRemoveClick = async () => {
    const _functionName = 'handleRemoveClick';

    if (!removePasskey || !systemInfo?.deviceID) {
      return;
    }

    // validate the password input
    if (validatePassword()) {
      logger.debug(
        `${RemovePasskeyModal.name}#${_functionName}: password not valid`
      );

      return;
    }

    await removePasskeyAction({
      deviceID: systemInfo.deviceID,
      password,
      passkey: removePasskey,
    });
  };
  // renders
  const renderContent = () => {
    const iconSize = calculateIconSize('xl');

    if (!removePasskey) {
      return;
    }

    if (encrypting) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*loader*/}
          <ReEncryptKeysLoadingContent
            encryptionProgressState={encryptionProgressState}
          />
        </VStack>
      );
    }

    if (requesting) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*loader*/}
          <Radio
            colors={[primaryColorCode, primaryColorCode, primaryColorCode]}
            height="80"
            width="80"
          />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.requestingPasskeyPermission', {
              name: removePasskey.name,
            })}
          </Text>
        </VStack>
      );
    }

    return (
      <VStack
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-start"
        spacing={DEFAULT_GAP}
        w="full"
      >
        {/*icon*/}
        <Icon as={GoShieldSlash} color="red.600" h={iconSize} w={iconSize} />

        {/*description*/}
        <Text
          as="b"
          color={subTextColor}
          fontSize="sm"
          textAlign="center"
          w="full"
        >
          {t<string>('captions.removePasskey', { name: removePasskey.name })}
        </Text>

        {/*instructions*/}
        <VStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.removePasskeyInstruction1')}
          </Text>

          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.removePasskeyInstruction2')}
          </Text>
        </VStack>
      </VStack>
    );
  };

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  // if there is an error from the hook, show a toast
  useEffect(() => {
    if (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));
          break;
        default:
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
          break;
      }
    }
  }, [error]);
  // if we have the updated the passkey close the modal
  // useEffect(() => {
  //   if (passkey) {
  //     handleClose();
  //   }
  // }, [passkey]);

  return (
    <Modal
      isOpen={!!removePasskey}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.removePasskey')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {/*password input*/}
            {!isLoading && (
              <PasswordInput
                error={passwordError}
                hint={t<string>(
                  'captions.mustEnterPasswordToReEncryptPrivateKeys'
                )}
                onChange={onPasswordChange}
                onKeyUp={handleKeyUpPasswordInput}
                inputRef={passwordInputRef}
                value={password}
              />
            )}

            {/*buttons*/}
            <HStack spacing={DEFAULT_GAP - 2} w="full">
              {/*cancel*/}
              <Button
                isDisabled={isLoading}
                onClick={handleCancelClick}
                size="lg"
                variant="outline"
                w="full"
              >
                {t<string>('buttons.cancel')}
              </Button>

              {/*remove*/}
              <Button
                isLoading={isLoading}
                onClick={handleRemoveClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.confirm')}
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemovePasskeyModal;
