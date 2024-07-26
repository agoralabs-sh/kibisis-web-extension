import { Icon, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  IoArrowDownOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
} from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

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
  const defaultTextColor = useDefaultTextColor();

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP / 2}
      w="full"
    >
      {/*progress*/}
      <CircularProgressWithIcon
        icon={reKeyType === 'undo' ? IoLockOpenOutline : IoLockClosedOutline}
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
