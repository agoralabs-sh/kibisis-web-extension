import { Heading, HStack, Spacer, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import Button from '../../components/Button';
import PopupShell from '../../components/PopupShell';

const CreatePasswordPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  const handleCreatePasswordClick = () => {
    console.log('password entered');
  };

  return (
    <PopupShell>
      <VStack flexGrow={1} spacing={5} w="full">
        <Heading color="gray.500">enter password</Heading>
        <Spacer />
        <HStack spacing={5} w="full">
          <Button
            colorScheme="primary"
            onClick={handleBackClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>
          <Button
            colorScheme="primary"
            onClick={handleCreatePasswordClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.create')}
          </Button>
        </HStack>
      </VStack>
    </PopupShell>
  );
}

export default CreatePasswordPage;
