import { HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IAccountUndoReKeyTransaction } from '@extension/types';
import type { IProps } from './types';

const AccountUndoReKeyTransactionItemContent: FC<
  IProps<IAccountUndoReKeyTransaction>
> = ({ accounts, network, transaction }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

  return (
    <>
      <VStack
        alignItems="flex-start"
        justifyContent="center"
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        {/*type*/}
        <Text color={defaultTextColor} fontSize="sm">
          {t<string>('headings.transaction', { context: transaction.type })}
        </Text>

        <HStack
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          w="full"
        >
          {/*undo re-key*/}
          {transaction.authAddr && (
            <AddressDisplay
              accounts={accounts}
              address={transaction.authAddr}
              colorScheme="red"
              size="xs"
              network={network}
            />
          )}

          {/*completed date*/}
          {transaction.completedAt && (
            <Text color={subTextColor} fontSize="xs">
              {new Date(transaction.completedAt).toLocaleString()}
            </Text>
          )}
        </HStack>
      </VStack>
    </>
  );
};

export default AccountUndoReKeyTransactionItemContent;
