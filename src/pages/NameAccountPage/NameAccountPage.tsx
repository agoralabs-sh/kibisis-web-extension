import {
  Heading,
  HStack,
  Input,
  InputGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '../../components/Button';
import RegistrationPageShell from '../../components/RegistrationPageShell';

// Features
import {
  clearPrivateKey,
  saveCredentials,
  setName,
} from '../../features/registration';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

// Selectors
import {
  useSelectLogger,
  useSelectRegistrationEncryptedPrivateKey,
} from '../../selectors';

// Types
import {
  IAppThunkDispatch,
  ILogger,
  IRegistrationRootState,
} from '../../types';

const NameAccountPage: FC = () => {
  const componentName: string = 'NameAccountPage';
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const logger: ILogger = useSelectLogger();
  const encryptedPrivateKey: string | null =
    useSelectRegistrationEncryptedPrivateKey();
  const name: string | null = useSelector<
    IRegistrationRootState,
    string | null
  >((state) => state.registration.name);
  const saving: boolean = useSelector<IRegistrationRootState, boolean>(
    (state) => state.registration.saving
  );
  const handleImportClick = () => {
    logger.debug(`${componentName}: importing account`);

    dispatch(saveCredentials());
  };
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(setName(event.target.value));
  const handlePreviousClick = () => dispatch(clearPrivateKey()); // clearing the key will trigger the page to navigate back

  useEffect(() => {
    if (!encryptedPrivateKey) {
      navigate(-1);
    }
  }, [encryptedPrivateKey]);

  return (
    <RegistrationPageShell>
      <VStack flexGrow={1} mb={8} spacing={8} w="full">
        <VStack spacing={3} w="full">
          <Heading color={defaultTextColor}>
            {t<string>('headings.nameAccount')}
          </Heading>
          <Text color={subTextColor}>{t<string>('captions.nameAccount')}</Text>
        </VStack>
        <VStack w="full">
          <Text color={defaultTextColor} textAlign="left" w="full">
            {t<string>('labels.accountName')}
          </Text>
          <InputGroup size="md">
            <Input
              disabled={saving}
              focusBorderColor="primary.500"
              onChange={handleOnChange}
              placeholder={t<string>('placeholders.nameAccount')}
              type="text"
              value={name || ''}
            />
          </InputGroup>
        </VStack>
      </VStack>
      <HStack mb={8} spacing={4} w="full">
        <Button
          colorScheme="primary"
          disabled={saving}
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
    </RegistrationPageShell>
  );
};

export default NameAccountPage;
