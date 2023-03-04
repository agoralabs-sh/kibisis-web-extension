import { Heading, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AgoraIcon from '../AgoraIcon';
import Button from '../Button';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const handleGetStartedClick = () => {
    console.log('lets get started!!');
  };

  return (
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
  );
}

export default GetStartedPage;
