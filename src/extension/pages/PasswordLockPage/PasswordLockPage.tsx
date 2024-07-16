import { Center, Flex, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
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
import { create as createNotification } from '@extension/features/notifications';
import { savePasswordLockThunk } from '@extension/features/password-lock';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// modals
import AuthenticationModal, {
  TOnConfirmResult,
} from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectLogger,
  useSelectPasswordLockCredentials,
  useSelectPasswordLockSaving,
} from '@extension/selectors';

// types
import type { IAppThunkDispatch } from '@extension/types';

const PasswordLockPage: FC = () => {
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
  const passwordLockPassword = useSelectPasswordLockCredentials();
  const saving = useSelectPasswordLockSaving();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // states
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const isLoading = saving || verifying;
  // handlers
  const handleOnAuthenticationError = (error: BaseExtensionError) =>
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
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    // save the password lock passkey/password and clear any alarms
    dispatch(savePasswordLockThunk(result));
  };

  useEffect(() => {
    if (passwordLockPassword) {
      navigate(-1);
    }
  }, [passwordLockPassword]);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnAuthenticationError}
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
                <KibisisIcon color={primaryColor} h={12} w={12} />

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

export default PasswordLockPage;
