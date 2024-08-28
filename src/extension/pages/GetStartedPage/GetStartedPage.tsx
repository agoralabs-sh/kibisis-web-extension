import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// components
import AnimatedKibisisIcon from '@extension/components/AnimatedKibisisIcon';
import Button from '@extension/components/Button';

// constants
import { CREATE_PASSWORD_ROUTE, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('xl');
  // handlers
  const handleGetStartedClick = () => navigate(CREATE_PASSWORD_ROUTE);

  return (
    <VStack
      flexGrow={1}
      pb={DEFAULT_GAP}
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      <VStack
        flexGrow={1}
        justifyContent="center"
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <AnimatedKibisisIcon color={primaryColor} boxSize={iconSize} />

        <Heading color={defaultTextColor}>{__APP_TITLE__}</Heading>

        {__VERSION__ && (
          <Text color={subTextColor} fontSize="sm">{`v${__VERSION__}`}</Text>
        )}
      </VStack>

      <Button
        onClick={handleGetStartedClick}
        rightIcon={<IoArrowForwardOutline />}
        size="lg"
        w="full"
      >
        {t<string>('buttons.getStarted')}
      </Button>
    </VStack>
  );
};

export default GetStartedPage;
