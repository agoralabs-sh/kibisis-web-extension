import {
  Code,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoShieldLock } from 'react-icons/go';
import { IoKeyOutline } from 'react-icons/io5';
import { Radio } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import COSEAlgorithmBadge from '@extension/components/COSEAlgorithmBadge';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import PasskeyCapabilities from '@extension/components/PasskeyCapabilities';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  MODAL_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// features
import { create as createNotification } from '@extension/features/notifications';
import {
  removeFromStorageThunk as removePasskeyCredentialFromStorageThunk,
  saveToStorageThunk as savePasskeyCredentialToStorageThunk,
} from '@extension/features/passkeys';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectLogger,
  useSelectPasskeysAddPasskey,
  useSelectPasskeysSaving,
  useSelectPasswordLockPassword,
  useSelectSettings,
  useSelectSystemInfo,
} from '@extension/selectors';

// services
import PasskeyService from '@extension/services/PasskeyService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IModalProps,
  IPasskeyCredential,
} from '@extension/types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const AddPasskeyModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isMoreInformationOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  // selectors
  const addPasskey = useSelectPasskeysAddPasskey();
  const logger = useSelectLogger();
  const passwordLockPassword = useSelectPasswordLockPassword();
  const saving = useSelectPasskeysSaving();
  const settings = useSelectSettings();
  const systemInfo = useSelectSystemInfo();
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
  const primaryColor = usePrimaryColor();
  const primaryColorCode = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const subTextColor = useSubTextColor();
  // state
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [requestingInputKeyMaterial, setRequestingInputKeyMaterial] =
    useState<boolean>(false);
  // misc
  const isLoading = encrypting || saving || requestingInputKeyMaterial;
  // handlers
  const handleCancelClick = async () => handleClose();
  const handleClose = () => {
    resetPassword();
    setEncrypting(false);
    setRequestingInputKeyMaterial(false);

    if (onClose) {
      onClose();
    }
  };
  const handleEncryptClick = async () => {
    const _functionName = 'handleEncryptClick';
    let _password: string | null;
    let passkey: IPasskeyCredential;
    let inputKeyMaterial: Uint8Array;

    if (!addPasskey) {
      return;
    }

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${AddPasskeyModal.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${AddPasskeyModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    // first save the passkey to storage
    passkey = await dispatch(
      savePasskeyCredentialToStorageThunk(addPasskey)
    ).unwrap();

    setRequestingInputKeyMaterial(true);

    try {
      logger.debug(
        `${AddPasskeyModal.name}#${_functionName}: requesting input key material from passkey "${passkey.id}"`
      );

      // fetch the encryption key material
      inputKeyMaterial = await PasskeyService.fetchInputKeyMaterialFromPasskey({
        credential: passkey,
        logger,
      });

      setRequestingInputKeyMaterial(false);
    } catch (error) {
      setRequestingInputKeyMaterial(false);

      // remove the previously saved credential
      dispatch(removePasskeyCredentialFromStorageThunk());

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

      return;
    }

    logger.debug(
      `${AddPasskeyModal.name}#${_functionName}: received input key material from passkey "${passkey.id}"`
    );

    setEncrypting(true);

    try {
      // let encryptedBytes = await PasskeyService.encryptBytes({
      //   bytes: new TextEncoder().encode(message),
      //   deviceID: systemInfo.deviceID,
      //   logger,
      //   initializationVector: decodeHex(credential.initializationVector),
      //   inputKeyMaterial,
      // });
      // let decryptedBytes = await PasskeyService.decryptBytes({
      //   deviceID: systemInfo.deviceID,
      //   encryptedBytes,
      //   initializationVector: decodeHex(credential.initializationVector),
      //   inputKeyMaterial,
      //   logger,
      // });

      dispatch(
        createNotification({
          description: t<string>('captions.passkeyAdded', {
            name: passkey.name,
          }),
          ephemeral: true,
          title: t<string>('headings.passkeyAdded'),
          type: 'success',
        })
      );

      handleClose();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));
          break;
        default:
          // remove the previously saved credential
          dispatch(removePasskeyCredentialFromStorageThunk());

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

    setEncrypting(false);
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleEncryptClick();
    }
  };
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationOpen() : onMoreInformationClose();
  // renders
  const renderContent = () => {
    const iconSize = calculateIconSize('xl');

    if (!addPasskey) {
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
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={defaultTextColor}
            color={primaryColorCode}
            size="xl"
          />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.encryptAccountsWithPasskey', {
              name: addPasskey.name,
            })}
          </Text>
        </VStack>
      );
    }

    if (requestingInputKeyMaterial) {
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
            {t<string>('captions.requestingPasskeyEncryptionKey', {
              name: addPasskey.name,
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
        <Icon as={GoShieldLock} color="blue.600" h={iconSize} w={iconSize} />

        {/*details*/}
        <VStack flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
          {/*name*/}
          <ModalTextItem
            label={`${t<string>('labels.name')}:`}
            tooltipLabel={addPasskey.name}
            value={addPasskey.name}
          />

          {/*credential id*/}
          <ModalItem
            fontSize="xs"
            label={`${t<string>('labels.credentialID')}:`}
            value={
              <HStack spacing={1}>
                <Code
                  borderRadius="md"
                  color={defaultTextColor}
                  fontSize="xs"
                  wordBreak="break-word"
                >
                  {addPasskey.id}
                </Code>

                {/*copy credential id button*/}
                <CopyIconButton
                  ariaLabel={t<string>('labels.copyCredentialID')}
                  tooltipLabel={t<string>('labels.copyCredentialID')}
                  value={addPasskey.id}
                />
              </HStack>
            }
          />

          {/*user id*/}
          {systemInfo?.deviceID && (
            <ModalItem
              fontSize="xs"
              label={`${t<string>('labels.userID')}:`}
              value={
                <HStack spacing={1}>
                  <Code
                    borderRadius="md"
                    color={defaultTextColor}
                    fontSize="xs"
                    wordBreak="break-word"
                  >
                    {systemInfo.deviceID}
                  </Code>

                  {/*copy user id button*/}
                  <CopyIconButton
                    ariaLabel={t<string>('labels.copyUserID')}
                    tooltipLabel={t<string>('labels.copyUserID')}
                    value={systemInfo.deviceID}
                  />
                </HStack>
              }
            />
          )}

          {/*capabilities*/}
          <ModalItem
            fontSize="xs"
            label={`${t<string>('labels.capabilities')}:`}
            value={<PasskeyCapabilities capabilities={addPasskey.transports} />}
          />

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="xs"
            isOpen={isMoreInformationOpen}
            minButtonHeight={MODAL_ITEM_HEIGHT}
            onChange={handleMoreInformationToggle}
          >
            <VStack spacing={0} w="full">
              {/*public key*/}
              <ModalItem
                fontSize="xs"
                label={`${t<string>('labels.publicKey')}:`}
                value={
                  <HStack spacing={1}>
                    <Code
                      borderRadius="md"
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {addPasskey.publicKey || '-'}
                    </Code>

                    {/*copy public key button*/}
                    {addPasskey.publicKey && (
                      <CopyIconButton
                        ariaLabel={t<string>('labels.copyPublicKey')}
                        tooltipLabel={t<string>('labels.copyPublicKey')}
                        value={addPasskey.publicKey}
                      />
                    )}
                  </HStack>
                }
              />

              {/*algorithm*/}
              <ModalItem
                fontSize="xs"
                label={`${t<string>('labels.algorithm')}:`}
                value={<COSEAlgorithmBadge algorithm={addPasskey.algorithm} />}
              />
            </VStack>
          </MoreInformationAccordion>
        </VStack>

        {/*captions*/}
        <VStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.encryptWithPasskey')}
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

  return (
    <Modal
      isOpen={!!addPasskey}
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
            {t<string>('headings.addPasskey')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {/*password input*/}
            {!settings.security.enablePasswordLock &&
              !passwordLockPassword &&
              !isLoading && (
                <PasswordInput
                  error={passwordError}
                  hint={t<string>(
                    'captions.mustEnterPasswordToDecryptPrivateKeys'
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

              {/*encrypt*/}
              <Button
                isLoading={isLoading}
                onClick={handleEncryptClick}
                rightIcon={<IoKeyOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.encrypt')}
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPasskeyModal;
