import {
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectLogger,
  useSelectCredentialLockActive,
  useSelectCredentialLockSaving,
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
  const saving = useSelectCredentialLockSaving();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // states
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const iconSize = calculateIconSize('xl');
  const isLoading = saving || verifying;
  const isOpen =
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
            <VStack flexGrow={1} justifyContent="center" spacing={0} w="full">
              <VStack spacing={DEFAULT_GAP / 3} w="full">
                {/*icon*/}
                <KibisisIcon color={primaryColor} h={iconSize} w={iconSize} />

                {/*heading*/}
                <Heading color={defaultTextColor}>
                  {t<string>('headings.welcomeBack')}
                </Heading>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter p={DEFAULT_GAP}>
            {/*unlock button*/}
            <Button
              isLoading={isLoading}
              onClick={handleUnlockClick}
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
