import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '@extension/components/Button';
import EnterMnemonicPhraseInput, {
  validate,
} from '@extension/components/EnterMnemonicPhraseInput';
import RegistrationPageShell from '@extension/components/RegistrationPageShell';

// Constants
import { NAME_ACCOUNT_ROUTE } from '@extension/constants';

// Features
import { setMnemonic } from '@extension/features/registration';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectLogger,
  useSelectRegistrationEncryptedPrivateKey,
} from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import { IAppThunkDispatch, IRegistrationRootState } from '@extension/types';

const EnterMnemonicPhrasePage: FC = () => {
  const componentName: string = 'EnterMnemonicPhrasePage';
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const logger: ILogger = useSelectLogger();
  const encryptedPrivateKey: string | null =
    useSelectRegistrationEncryptedPrivateKey();
  const encrypting: boolean = useSelector<IRegistrationRootState, boolean>(
    (state) => state.registration.encrypting
  );
  const [error, setError] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<string[]>(
    Array.from({ length: 25 }, () => '')
  );
  const handleNextClick = () => {
    const validateError: string | null = validate(phrases, t);

    setError(validateError);

    if (!validateError) {
      logger.debug(`${componentName}: mnemonic valid, encrypting`);

      dispatch(setMnemonic(phrases.join(' ')));
    }
  };
  const handleOnChange = (phrases: string[]) => {
    setPhrases(phrases);
  };
  const handlePreviousClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (encryptedPrivateKey) {
      logger.debug(
        `${componentName}: mnemonic encrypted, navigating "${NAME_ACCOUNT_ROUTE}"`
      );

      navigate(NAME_ACCOUNT_ROUTE);
    }
  }, [encryptedPrivateKey]);

  return (
    <RegistrationPageShell>
      <VStack flexGrow={1} mb={8} spacing={8} w="full">
        <VStack spacing={3} w="full">
          <Heading color={defaultTextColor}>
            {t<string>('headings.importAccount')}
          </Heading>
          <Text color={subTextColor}>
            {t<string>('captions.importAccount')}
          </Text>
        </VStack>
        <EnterMnemonicPhraseInput
          disabled={encrypting}
          error={error}
          onChange={handleOnChange}
          phrases={phrases}
        />
      </VStack>
      <HStack mb={8} spacing={4} w="full">
        <Button
          colorScheme="primary"
          onClick={handlePreviousClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.previous')}
        </Button>
        <Button
          colorScheme="primary"
          isLoading={encrypting}
          onClick={handleNextClick}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.next')}
        </Button>
      </HStack>
    </RegistrationPageShell>
  );
};

export default EnterMnemonicPhrasePage;
