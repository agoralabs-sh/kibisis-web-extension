import { Box, Button, Stack, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowForwardOutline } from 'react-icons/io5';

// components
import AtomicTransactionsContent from '@extension/modals/SignTxnsModal/AtomicTransactionsContent';
import ChainBadge from '@extension/components/ChainBadge';
import ModalItem from '@extension/components/ModalItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import ModalTextItem from '@extension/components/ModalTextItem';
import SingleTransactionContent from '@extension/modals/SignTxnsModal/SingleTransactionContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// contexts
import { MultipleTransactionsContext } from './contexts';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import usePrimaryColorSchemer from '@extension/hooks/usePrimaryColorScheme';

// selectors
import { useSelectNetworks } from '@extension/selectors';

// types
import type { INetwork } from '@extension/types';
import type { IMultipleTransactionsContextValue } from './types';

// utils
import computeGroupId from '@common/utils/computeGroupId';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

interface IProps {
  groupsOfTransactions: Transaction[][];
}

const MultipleTransactionsContent: FC<IProps> = ({
  groupsOfTransactions,
}: IProps) => {
  const { t } = useTranslation();
  // selectors
  const networks: INetwork[] = useSelectNetworks();
  // contexts
  const context: IMultipleTransactionsContextValue | null = useContext(
    MultipleTransactionsContext
  );
  // hooks
  const borderColor: string = useBorderColor();
  const primaryColorScheme: string = usePrimaryColorSchemer();
  // handlers
  const handleMoreDetailsClick = (index: number) => () =>
    context &&
    context.setMoreDetailsTransactions(groupsOfTransactions[index] || null);

  // if we have transactions, it means the "more details" button has been pressed
  if (
    context &&
    context.moreDetailsTransactions &&
    context.moreDetailsTransactions.length > 0
  ) {
    // if the transactions is a greater that one, it will be atomic transactions
    if (context.moreDetailsTransactions.length > 1) {
      return (
        <AtomicTransactionsContent
          transactions={context.moreDetailsTransactions}
        />
      );
    }

    // otherwise it will be a single transaction
    return (
      <SingleTransactionContent
        transaction={context.moreDetailsTransactions[0]}
      />
    );
  }

  return (
    <VStack spacing={4} w="full">
      {groupsOfTransactions.map((transactions, index) => {
        const genesisHash: string | null =
          uniqueGenesisHashesFromTransactions(transactions).pop() || null;
        let computedGroupId: string | null = null;
        const network: INetwork | null =
          networks.find((value) => value.genesisHash === genesisHash) || null;

        // for atomic transactions add a group id
        if (transactions.length > 1) {
          computedGroupId = encodeBase64(computeGroupId(transactions));
        }

        return (
          <Box
            borderColor={borderColor}
            borderRadius="md"
            borderStyle="solid"
            borderWidth={1}
            key={`sign-txns-modal-multiple-transactions-item-${index}`}
            px={DEFAULT_GAP - 2}
            py={DEFAULT_GAP / 3}
            w="full"
          >
            <VStack
              alignItems="center"
              justifyContent="flex-start"
              spacing={2}
              w="full"
            >
              {/*number of transactions*/}
              <ModalSubHeading
                text={t<string>('headings.numberOfTransactions', {
                  ...(transactions.length > 1 && {
                    context: 'multiple',
                  }),
                  number: transactions.length,
                })}
              />

              {/*group id*/}
              {computedGroupId && (
                <ModalTextItem
                  label={`${t<string>('labels.groupId')}:`}
                  value={computedGroupId}
                />
              )}

              {/*network*/}
              {network && (
                <ModalItem
                  label={t<string>('labels.network')}
                  value={<ChainBadge network={network} />}
                />
              )}

              <Stack alignItems="flex-end" justifyContent="center" w="full">
                <Button
                  colorScheme={primaryColorScheme}
                  onClick={handleMoreDetailsClick(index)}
                  rightIcon={<IoArrowForwardOutline />}
                  size="md"
                  variant="ghost"
                >
                  {t<string>('buttons.moreDetails')}
                </Button>
              </Stack>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default MultipleTransactionsContent;
