import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// components
import KibisisIcon from '@extension/components/KibisisIcon';
import Button from '@extension/components/Button';

// constants
import { CREATE_PASSWORD_ROUTE, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // handlers
  const handleGetStartedClick = () => navigate(CREATE_PASSWORD_ROUTE);

  return (
    <VStack flexGrow={1} pb={DEFAULT_GAP} px={DEFAULT_GAP} spacing={2} w="full">
      <VStack flexGrow={1} justifyContent="center" spacing={2} w="full">
        <KibisisIcon color={primaryColor} h={12} w={12} />

        <Heading color={defaultTextColor}>{__APP_TITLE__}</Heading>

        {__VERSION__ && (
          <Text color={subTextColor} fontSize="sm">{`v${__VERSION__}`}</Text>
        )}
      </VStack>

      <Button onClick={handleGetStartedClick} size="lg" w="full">
        {t<string>('buttons.getStarted')}
      </Button>
    </VStack>
  );
};

export default GetStartedPage;
