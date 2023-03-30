import { Badge, Heading, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import AgoraIcon from '../../components/AgoraIcon';
import Button from '../../components/Button';
import RegistrationPageShell from '../../components/RegistrationPageShell';

// Constants
import { CREATE_PASSWORD_ROUTE } from '../../constants';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const handleGetStartedClick = () => {
    navigate(CREATE_PASSWORD_ROUTE);
  };

  return (
    <RegistrationPageShell>
      <VStack flexGrow={1} justifyContent="center" spacing={1} w="full">
        <AgoraIcon color="primary.500" h={12} w={12} />
        <Heading color="gray.500">{__APP_TITLE__}</Heading>
        {__VERSION__ && (
          <Text color="gray.400" fontSize="sm">{`v${__VERSION__}`}</Text>
        )}
        {__ENV__ === 'development' && (
          <Badge colorScheme="green" variant="subtle">
            {__ENV__}
          </Badge>
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
