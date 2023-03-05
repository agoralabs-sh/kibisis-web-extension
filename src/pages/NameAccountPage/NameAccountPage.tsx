import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '../../components/Button';
import PopupShell from '../../components/PopupShell';

// Features
import { clearPrivateKey } from '../../features/register';

// Selectors
import { useSelectLogger, useSelectRegisterEncryptedPrivateKey } from '../../selectors';

// Types
import { IAppThunkDispatch, ILogger, IRootState } from '../../types';

const NameAccountPage: FC = () => {
  const componentName: string = 'NameAccountPage';
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const encryptedPrivateKey: string | null = useSelectRegisterEncryptedPrivateKey();
  const saving: boolean = useSelector<IRootState, boolean>((state) => state.register.saving);
  const handleImportClick = () => {
    console.log('import wallet!');
  };
  const handlePreviousClick = () => {
    dispatch(clearPrivateKey());
  };

  useEffect(() => {
    if (!encryptedPrivateKey) {
      navigate(-1);
    }
  }, [encryptedPrivateKey]);

  return (
    <PopupShell>
      <VStack flexGrow={1} mb={8}  spacing={3} w="full">
        <Heading color="gray.500">{t<string>('headings.nameAccount')}</Heading>
        <Text color="gray.400">{t<string>('captions.nameAccount')}</Text>
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
          isLoading={saving}
          onClick={handleImportClick}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.import')}
        </Button>
      </HStack>
    </PopupShell>
  );
}

export default NameAccountPage;
