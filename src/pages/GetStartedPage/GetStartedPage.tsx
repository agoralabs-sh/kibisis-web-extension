import { Heading, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import AgoraIcon from '../../components/AgoraIcon';
import Button from '../../components/Button';
import PopupShell from '../../components/PopupShell';

// Constants
import { CREATE_PASSWORD_ROUTE } from '../../constants';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const handleGetStartedClick = () => {
    navigate(CREATE_PASSWORD_ROUTE);
  };

  return (
    <PopupShell>
      <VStack spacing={5} w="full">
        <AgoraIcon color="primary.500" h={12} w={12} />
        <Heading color="gray.500">Agora Wallet</Heading>
        <Button
          colorScheme="primary"
          onClick={handleGetStartedClick}
          size="lg"
          w="full"
        >
          {t<string>('buttons.getStarted')}
        </Button>
      </VStack>
    </PopupShell>
  );
}

export default GetStartedPage;
