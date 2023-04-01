import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Button from '../../components/Button';
import CreatePasswordInput, {
  validate,
} from '../../components/CreatePasswordInput';
import RegistrationPageShell from '../../components/RegistrationPageShell';

// Constants
import { ENTER_MNEMONIC_PHRASE_ROUTE } from '../../constants';

// Features
import { setPassword } from '../../features/registration';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

// Types
import { IAppThunkDispatch, IRegistrationRootState } from '../../types';

const CreatePasswordPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const password: string | null = useSelector<
    IRegistrationRootState,
    string | null
  >((state) => state.registration.password);
  const score: number = useSelector<IRegistrationRootState, number>(
    (state) => state.registration.score
  );
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleNextClick = () => {
    if (!validate(password || '', score, t)) {
      navigate(ENTER_MNEMONIC_PHRASE_ROUTE);
    }
  };
  const handlePasswordChange = (password: string, score: number) => {
    dispatch(
      setPassword({
        password,
        score,
      })
    );
  };
  const handlePreviousClick = () => {
    navigate(-1);
  };

  return (
    <RegistrationPageShell>
      <VStack flexGrow={1} mb={8} spacing={8} w="full">
        <VStack spacing={3} w="full">
          <Heading color={defaultTextColor}>
            {t<string>('headings.createPassword')}
          </Heading>
          <Text color={subTextColor}>
            {t<string>('captions.createPassword1')}
          </Text>
          <Text color={subTextColor}>
            {t<string>('captions.createPassword2')}
          </Text>
        </VStack>
        <CreatePasswordInput
          onChange={handlePasswordChange}
          score={score}
          value={password || ''}
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

export default CreatePasswordPage;
