import { Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowDownOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IConfirmingModalContentProps } from './types';

const ReKeyAccountConfirmingModalContent: FC<IConfirmingModalContentProps> = ({
  accounts,
  currentAddress,
  network,
  reKeyAddress,
  reKeyType,
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
      {/*description*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="center" w="full">
        {t<string>(
          reKeyType === 'undo'
            ? 'captions.undoReKeyAccountConfirming'
            : 'captions.reKeyAccountConfirming'
        )}
      </Text>

      {/*current address*/}
      <AddressDisplay
        accounts={accounts}
        address={currentAddress}
        ariaLabel="Current address"
        colorScheme="red"
        size="md"
        network={network}
      />

      <Icon as={IoArrowDownOutline} color={defaultTextColor} h={8} w={8} />

      {/*re-key address*/}
      <AddressDisplay
        accounts={accounts}
        address={reKeyAddress}
        ariaLabel="Re-key address"
        colorScheme="green"
        size="md"
        network={network}
      />
    </VStack>
  );
};

export default ReKeyAccountConfirmingModalContent;
