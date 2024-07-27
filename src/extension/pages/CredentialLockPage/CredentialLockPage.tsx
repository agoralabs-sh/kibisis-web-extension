import { Center, Flex, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import KibisisIcon from '@extension/components/KibisisIcon';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { enableThunk as enableCredentialLockThunk } from '@extension/features/credential-lock';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectLogger,
  useSelectPasswordLockSaving,
} from '@extension/selectors';

// types
import type { TOnConfirmResult } from '@extension/modals/AuthenticationModal';
import type { IAppThunkDispatch } from '@extension/types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const CredentialLockPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const logger = useSelectLogger();
  const saving = useSelectPasswordLockSaving();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // states
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const iconSize = calculateIconSize('xl');
  const isLoading = saving || verifying;
  // handlers
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';

    // reactivate the credential lock timeout alarm and decrypt the keys
    try {
      await dispatch(enableCredentialLockThunk(result)).unwrap();

      // if complete, navigate back
      navigate(-1);
    } catch (error) {
      logger.error(`${CredentialLockPage.name}#${_functionName}:`, error);

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
  const handleUnlockClick = () => onAuthenticationModalOpen();

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
        passwordHint={t<string>('captions.mustEnterPasswordToUnlock')}
      />

      <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
        <Flex
          alignItems="center"
          direction="column"
          justifyContent="center"
          minH="100vh"
          w="full"
        >
          <VStack
            flexGrow={1}
            pb={DEFAULT_GAP}
            px={DEFAULT_GAP}
            spacing={DEFAULT_GAP / 3}
            w="full"
          >
            <VStack
              flexGrow={1}
              justifyContent="center"
              spacing={DEFAULT_GAP / 3}
              w="full"
            >
              <VStack pb={DEFAULT_GAP} spacing={DEFAULT_GAP / 3} w="full">
                {/*icon*/}
                <KibisisIcon color={primaryColor} h={iconSize} w={iconSize} />

                {/*heading*/}
                <Heading color={defaultTextColor}>
                  {t<string>('headings.passwordLock')}
                </Heading>
              </VStack>
            </VStack>

            {/*unlock button*/}
            <Button
              isLoading={isLoading}
              onClick={handleUnlockClick}
              size="lg"
              w="full"
            >
              {t<string>('buttons.unlock')}
            </Button>
          </VStack>
        </Flex>
      </Center>
    </>
  );
};

export default CredentialLockPage;
