import { Center, Flex, Heading, VStack } from '@chakra-ui/react';
import React, {
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';

// components
import KibisisIcon from '@extension/components/KibisisIcon';
import Button from '@extension/components/Button';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import { savePasswordLockThunk } from '@extension/features/password-lock';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import {
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectPasswordLockSaving,
} from '@extension/selectors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type { IAppThunkDispatch } from '@extension/types';

const PasswordLockPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  // selectors
  const logger: ILogger = useSelectLogger();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const saving: boolean = useSelectPasswordLockSaving();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const primaryColor: string = usePrimaryColor();
  // states
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const isLoading: boolean = saving || verifying;
  // handlers
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleConfirmClick();
    }
  };
  const handleConfirmClick = async () => {
    let isValid: boolean;
    let privateKeyService: PrivateKeyService;

    // check if the input is valid
    if (validatePassword()) {
      return;
    }

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    setVerifying(true);

    isValid = await privateKeyService.verifyPassword(password);

    setVerifying(false);

    if (!isValid) {
      setPasswordError(t<string>('errors.inputs.invalidPassword'));

      return;
    }

    // save the password lock password and clear any alarms
    dispatch(savePasswordLockThunk(password));
  };

  // focus on password input
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (passwordLockPassword) {
      navigate(-1);
    }
  }, [passwordLockPassword]);

  return (
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
          spacing={2}
          w="full"
        >
          <VStack flexGrow={1} justifyContent="center" spacing={2} w="full">
            <VStack pb={DEFAULT_GAP} spacing={2} w="full">
              {/*icon*/}
              <KibisisIcon color={primaryColor} h={12} w={12} />

              {/*heading*/}
              <Heading color={defaultTextColor}>
                {t<string>('headings.passwordLock')}
              </Heading>
            </VStack>

            {/*password input*/}
            <PasswordInput
              disabled={isLoading}
              error={passwordError}
              hint={t<string>('captions.mustEnterPasswordToUnlock')}
              inputRef={passwordInputRef}
              onChange={onPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
              value={password || ''}
            />
          </VStack>

          {/*confirm button*/}
          <Button
            isLoading={isLoading}
            onClick={handleConfirmClick}
            size="lg"
            w="full"
          >
            {t<string>('buttons.confirm')}
          </Button>
        </VStack>
      </Flex>
    </Center>
  );
};

export default PasswordLockPage;
