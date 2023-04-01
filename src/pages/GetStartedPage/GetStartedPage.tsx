import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import AgoraIcon from '../../components/AgoraIcon';
import Button from '../../components/Button';
import RegistrationPageShell from '../../components/RegistrationPageShell';

// Constants
import { CREATE_PASSWORD_ROUTE } from '../../constants';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleGetStartedClick = () => {
    navigate(CREATE_PASSWORD_ROUTE);
  };

  return (
    <RegistrationPageShell>
      <VStack flexGrow={1} justifyContent="center" spacing={1} w="full">
        <AgoraIcon color="primary.500" h={12} w={12} />
        <Heading color={defaultTextColor}>{__APP_TITLE__}</Heading>
        {__VERSION__ && (
          <Text color={subTextColor} fontSize="sm">{`v${__VERSION__}`}</Text>
        )}
      </VStack>
      <Button
        colorScheme="primary"
        mb={8}
        onClick={handleGetStartedClick}
        size="lg"
        w="full"
      >
        {t<string>('buttons.getStarted')}
      </Button>
    </RegistrationPageShell>
  );
};

export default GetStartedPage;
