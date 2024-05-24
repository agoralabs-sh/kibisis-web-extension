import { Spinner, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IConfirmingModalContentProps } from './types';

const ReKeyAccountConfirmingModalContent: FC<IConfirmingModalContentProps> = ({
  authAddress,
  reKeyAddress,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP / 2}
      w="full"
    >
      <Spinner
        color={primaryColor}
        emptyColor={defaultTextColor}
        size="xl"
        speed="0.65s"
        thickness="4px"
      />

      <Text color={defaultTextColor} fontSize="md" textAlign="center" w="full">
        {t<string>('captions.undoReKeyConfirming', {
          authAddress,
          reKeyAddress,
        })}
      </Text>
    </VStack>
  );
};

export default ReKeyAccountConfirmingModalContent;
