import { HStack, Skeleton, Spacer, Text, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectARC0200AssetsUpdating,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IARC0200Asset,
  IARC0200AssetTransferTransaction,
} from '@extension/types';
import type { IProps } from './types';

const ARC0200AssetTransferTransactionItemContent: FC<
  IProps<IARC0200AssetTransferTransaction>
> = ({ account, network, transaction }) => {
  const { t } = useTranslation();
  // selectors
  const assets = useSelectARC0200AssetsBySelectedNetwork();
  const updating = useSelectARC0200AssetsUpdating();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // state
  const [asset, setAsset] = useState<IARC0200Asset | null>(null);
  // misc
  const amount = new BigNumber(String(transaction.amount));
  const senderAddress = AccountService.convertPublicKeyToAlgorandAddress(
    account.publicKey
  );

  useEffect(() => {
    setAsset(
      assets.find((value) => value.id === transaction.applicationId) || null
    );
  }, [assets]);

  return (
    <>
      <VStack
        alignItems="flex-start"
        justifyContent="center"
        spacing={DEFAULT_GAP / 3}
      >
        {/*type*/}
        <Text color={defaultTextColor} fontSize="sm">
          {t<string>('headings.transaction', { context: transaction.type })}
        </Text>

        {/*from*/}
        <AddressDisplay
          address={transaction.sender}
          color={subTextColor}
          fontSize="xs"
          network={network}
        />
      </VStack>

      <Spacer />

      <VStack
        alignItems="flex-end"
        justifyContent="center"
        spacing={DEFAULT_GAP / 3}
      >
        {/*amount*/}
        {!asset || updating ? (
          <Skeleton>
            <HStack spacing={1}>
              <Text color={subTextColor} fontSize="sm">
                0.001
              </Text>
            </HStack>
          </Skeleton>
        ) : (
          <AssetDisplay
            atomicUnitAmount={amount}
            amountColor={
              amount.lte(0)
                ? defaultTextColor
                : transaction.receiver === senderAddress
                ? 'green.500'
                : 'red.500'
            }
            decimals={asset.decimals}
            displayUnit={true}
            fontSize="sm"
            prefix={
              amount.lte(0)
                ? undefined
                : transaction.receiver === senderAddress
                ? '+'
                : '-'
            }
            unit={asset.symbol}
          />
        )}

        {/*completed date*/}
        {transaction.completedAt && (
          <Text color={subTextColor} fontSize="xs">
            {new Date(transaction.completedAt).toLocaleString()}
          </Text>
        )}
      </VStack>
    </>
  );
};

export default ARC0200AssetTransferTransactionItemContent;
