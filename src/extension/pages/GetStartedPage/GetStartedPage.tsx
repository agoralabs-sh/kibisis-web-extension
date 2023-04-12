import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import AgoraIcon from '@extension/components/AgoraIcon';
import Button from '@extension/components/Button';

// Constants
import { CREATE_PASSWORD_ROUTE, DEFAULT_GAP } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleGetStartedClick = () => navigate(CREATE_PASSWORD_ROUTE);

  return (
    <VStack flexGrow={1} pb={DEFAULT_GAP} px={DEFAULT_GAP} spacing={2} w="full">
      <VStack flexGrow={1} justifyContent="center" spacing={1} w="full">
        <AgoraIcon color="primary.500" h={12} w={12} />
        <Heading color={defaultTextColor}>{__APP_TITLE__}</Heading>
        {__VERSION__ && (
          <Text color={subTextColor} fontSize="sm">{`v${__VERSION__}`}</Text>
        )}
      </VStack>
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
};

export default GetStartedPage;
