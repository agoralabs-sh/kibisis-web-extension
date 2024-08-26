import { Text, VStack } from '@chakra-ui/react';
import React, { type FC, type KeyboardEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import NewPasswordInput from '@extension/components/NewPasswordInput';
import PageHeader from '@extension/components/PageHeader';

// constants
import { ADD_ACCOUNT_ROUTE, DEFAULT_GAP } from '@extension/constants';

// features
import { setPassword } from '@extension/features/registration';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useNewPasswordInput from '@extension/hooks/useNewPasswordInput';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type {
  IAppThunkDispatch,
  IRegistrationRootState,
} from '@extension/types';

const CreatePasswordPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IRegistrationRootState>>();
  const navigate = useNavigate();
  const newPasswordInputRef = useRef<HTMLInputElement | null>(null);
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    error: newPasswordError,
    label: newPasswordLabel,
    onBlur: handleOnNewPasswordBlur,
    onChange: handleOnNewPasswordChange,
    required: isNewPasswordRequired,
    score: newPasswordScore,
    validate: newPasswordValidate,
    value: newPasswordValue,
  } = useNewPasswordInput({
    label: t<string>('labels.newPassword'),
    required: true,
  });
  const subTextColor = useSubTextColor();
  // handlers
  const handleOnNewPasswordKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNextClick();
    }
  };
  const handleNextClick = () => {
    if (
      !!newPasswordError ||
      !!newPasswordValidate({
        score: newPasswordScore,
        value: newPasswordValue,
      })
    ) {
      return;
    }

    // set the password
    dispatch(setPassword(newPasswordValue));

    navigate(ADD_ACCOUNT_ROUTE);
  };

  // focus on password input
  useEffect(() => {
    if (newPasswordInputRef.current) {
      newPasswordInputRef.current.focus();
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
        spacing={DEFAULT_GAP / 3}
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
          <NewPasswordInput
            error={newPasswordError}
            label={newPasswordLabel}
            onBlur={handleOnNewPasswordBlur}
            onChange={handleOnNewPasswordChange}
            onKeyUp={handleOnNewPasswordKeyUp}
            ref={newPasswordInputRef}
            required={isNewPasswordRequired}
            score={newPasswordScore}
            value={newPasswordValue}
          />
        </VStack>

        {/*next button*/}
        <Button
          onClick={handleNextClick}
          rightIcon={<IoArrowForwardOutline />}
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
