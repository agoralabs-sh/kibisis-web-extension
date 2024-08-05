import {
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoShieldLock } from 'react-icons/go';
import { IoLockOpenOutline } from 'react-icons/io5';
import { PiPassword } from 'react-icons/pi';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import KibisisIcon from '@extension/components/KibisisIcon';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { BaseExtensionError, MalformedDataError } from '@extension/errors';

// features
import { deactivateThunk as deactivateCredentialLockThunk } from '@extension/features/credential-lock';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectLogger,
  useSelectCredentialLockActive,
  useSelectCredentialLockSaving,
  useSelectPasskeysPasskey,
  useSelectSettings,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const CredentialLockModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const active = useSelectCredentialLockActive();
  const logger = useSelectLogger();
  const passkey = useSelectPasskeysPasskey();
  const saving = useSelectCredentialLockSaving();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // states
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const authenticationTypeIconSize = calculateIconSize('md');
  const iconSize = calculateIconSize('xl');
  const isLoading = saving || verifying;
  const isOpen =
    !saving &&
    active &&
    settings.security.enableCredentialLock &&
    settings.security.credentialLockTimeoutDuration > 0;
  // handlers
  const handleClose = () => setVerifying(false);
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';

    try {
      if (result.type === EncryptionMethodEnum.Unencrypted) {
        throw new MalformedDataError(
          'deactivating credential lock requires encryption credentials'
        );
      }

      setVerifying(true);

      await dispatch(deactivateCredentialLockThunk(result)).unwrap();
    } catch (error) {
      logger.error(`${CredentialLockModal.name}#${_functionName}:`, error);

      handleOnError(error);
    }

    setVerifying(false);
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
  const handleUnlockClick = async () => onAuthenticationModalOpen();

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        forceAuthentication={true}
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
        passwordHint={t<string>('captions.mustEnterPasswordToUnlock')}
      />

      <Modal
        isOpen={isOpen}
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
          <ModalBody display="flex" p={DEFAULT_GAP}>
            <VStack
              flexGrow={1}
              justifyContent="center"
              spacing={DEFAULT_GAP}
              w="full"
            >
              {/*icon*/}
              <KibisisIcon color={primaryColor} h={iconSize} w={iconSize} />

              <VStack
                justifyContent="center"
                spacing={DEFAULT_GAP / 3}
                w="full"
              >
                {/*heading*/}
                <Heading color={defaultTextColor} textAlign="center" w="full">
                  {t<string>('headings.welcomeBack')}
                </Heading>

                {/*caption*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="center"
                  w="full"
                >
                  {t<string>('captions.removeCredentialLock', {
                    context: passkey ? 'passkey' : 'password',
                  })}
                </Text>

                <Icon
                  as={passkey ? GoShieldLock : PiPassword}
                  color={subTextColor}
                  h={authenticationTypeIconSize}
                  w={authenticationTypeIconSize}
                />
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter p={DEFAULT_GAP}>
            {/*unlock button*/}
            <Button
              isLoading={isLoading}
              onClick={handleUnlockClick}
              rightIcon={<IoLockOpenOutline />}
              size="lg"
              w="full"
            >
              {t<string>('buttons.unlock')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CredentialLockModal;
