import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '../../components/Button';
import EnterMnemonicPhraseInput, { validate } from '../../components/EnterMnemonicPhraseInput';
import PopupShell from '../../components/PopupShell';

// Constants
import { NAME_ACCOUNT_ROUTE } from '../../constants';

// Features
import { setPrivateKey } from '../../features/register';

// Selectors
import { useSelectLogger } from '../../selectors';

// Types
import { IAppThunkDispatch, ILogger, IRootState } from '../../types';

const EnterMnemonicPhrasePage: FC = () => {
  const componentName: string = 'EnterMnemonicPhrasePage';
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const encryptedPrivateKey: string | null = useSelector<IRootState, string | null>((state) => state.register.encryptedPrivateKey);
  const encrypting: boolean = useSelector<IRootState, boolean>((state) => state.register.encrypting);
  const [error, setError] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<string[]>(Array.from({ length: 25 }, () => ''));
  const handleNextClick = () => {
    const validateError: string | null = validate(phrases, t);

    setError(validateError);

    if (!validateError) {
      logger.debug(`${componentName}: mnemonic valid, encrypting`);

      dispatch(setPrivateKey(phrases.join(' ')));
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
      logger.debug(`${componentName}: mnemonic encrypted, navigating "${NAME_ACCOUNT_ROUTE}"`);

      navigate(NAME_ACCOUNT_ROUTE);
    }
  }, [encryptedPrivateKey]);

  return (
    <PopupShell>
      <VStack flexGrow={1} mb={8}  spacing={3} w="full">
        <Heading color="gray.500">{t<string>('headings.importAccount')}</Heading>
        <Text color="gray.400">{t<string>('captions.importAccount')}</Text>
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
    </PopupShell>
  );
}

export default EnterMnemonicPhrasePage;
