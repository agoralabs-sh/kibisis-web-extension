import { Text, VStack } from '@chakra-ui/react';
import React, { FC, KeyboardEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import CreatePasswordInput, {
  validate,
} from '@extension/components/CreatePasswordInput';
import PageHeader from '@extension/components/PageHeader';

// constants
import { ADD_ACCOUNT_ROUTE, DEFAULT_GAP } from '@extension/constants';

// features
import { setPassword } from '@extension/features/registration';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectRegistrationPassword,
  useSelectRegistrationScore,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IRegistrationRootState,
} from '@extension/types';

const CreatePasswordPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IRegistrationRootState>>();
  const createPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // selectors
  const password = useSelectRegistrationPassword();
  const score = useSelectRegistrationScore();
  // handlers
  const handleKeyUpCreatePasswordInput = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleNextClick();
    }
  };
  const handleNextClick = () => {
    if (!validate(password || '', score, t)) {
      navigate(ADD_ACCOUNT_ROUTE);
    }
  };
  const handlePasswordChange = (newPassword: string, newScore: number) => {
    dispatch(
      setPassword({
        password: newPassword,
        score: newScore,
      })
    );
  };

  // focus on password input
  useEffect(() => {
    if (createPasswordInputRef.current) {
      createPasswordInputRef.current.focus();
    }
  }, []);

  return (
    <>
      {/*page title*/}
      <PageHeader
        title={t<string>('titles.page', { context: 'createPassword' })}
      />

      <VStack
        flexGrow={1}
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={2}
        w="full"
      >
        <VStack flexGrow={1} spacing={DEFAULT_GAP + 2} w="full">
          {/*descriptions*/}
          <VStack spacing={DEFAULT_GAP / 2} w="full">
            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {t<string>('captions.createPassword1')}
            </Text>

            <Text color={subTextColor} fontSize="sm" textAlign="left" w="full">
              {t<string>('captions.createPassword2')}
            </Text>
          </VStack>

          {/*create password input*/}
          <CreatePasswordInput
            inputRef={createPasswordInputRef}
            onChange={handlePasswordChange}
            onKeyUp={handleKeyUpCreatePasswordInput}
            score={score}
            value={password || ''}
          />
        </VStack>

        {/*next button*/}
        <Button
          onClick={handleNextClick}
          size="lg"
          type="submit"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.next')}
        </Button>
      </VStack>
    </>
  );
};

export default CreatePasswordPage;
