import { Box, Button, Stack, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowForwardOutline } from 'react-icons/io5';

// components
import ChainBadge from '@extension/components/ChainBadge';
import ModalItem from '@extension/components/ModalItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import ModalTextItem from '@extension/components/ModalTextItem';
import AtomicTransactionsContent from './AtomicTransactionsContent';
import SingleTransactionContent from './SingleTransactionContent';

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
import type { IGroupOfTransactionsContentProps } from './types';

// utils
import computeGroupId from '@common/utils/computeGroupId';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

const GroupOfTransactionsContent: FC<IGroupOfTransactionsContentProps> = ({
  groupsOfTransactions,
}) => {
  const { t } = useTranslation();
  // selectors
  const networks = useSelectNetworks();
  // contexts
  const context = useContext(MultipleTransactionsContext);
  // hooks
  const borderColor = useBorderColor();
  const primaryColorScheme = usePrimaryColorSchemer();
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
    <VStack spacing={DEFAULT_GAP - 2} w="full">
      {groupsOfTransactions.map((transactions, index) => {
        const genesisHash =
          uniqueGenesisHashesFromTransactions(transactions).pop() || null;
        let computedGroupId = null;
        const network =
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

export default GroupOfTransactionsContent;
