import { HStack, Skeleton, Spacer, Text, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useStandardAssetById from '@extension/hooks/useStandardAssetById';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IAssetTransferTransaction } from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const AssetTransferTransactionItemContent: FC<
  IProps<IAssetTransferTransaction>
> = ({ account, accounts, network, transaction }) => {
  const { t } = useTranslation();
  // hooks
  const { standardAsset, updating } = useStandardAssetById(transaction.assetId);
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const accountAddress: string = convertPublicKeyToAVMAddress(
    PrivateKeyService.decode(account.publicKey)
  );
  const amount: BigNumber = new BigNumber(String(transaction.amount));

  return (
    <>
      <VStack alignItems="flex-start" justifyContent="center" spacing={2}>
        {/*type*/}
        <Text color={defaultTextColor} fontSize="sm">
          {t<string>('headings.transaction', { context: transaction.type })}
        </Text>

        {/*from*/}
        <AddressDisplay
          accounts={accounts}
          address={transaction.sender}
          size="xs"
          network={network}
        />
      </VStack>

      <Spacer />

      <VStack alignItems="flex-end" justifyContent="center" spacing={2}>
        {/*amount*/}
        {!standardAsset || updating ? (
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
                : transaction.receiver === accountAddress
                ? 'green.500'
                : 'red.500'
            }
            decimals={standardAsset.decimals}
            displayUnit={true}
            fontSize="sm"
            prefix={
              amount.lte(0)
                ? undefined
                : transaction.receiver === accountAddress
                ? '+'
                : '-'
            }
            unit={standardAsset.unitName || undefined}
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

export default AssetTransferTransactionItemContent;
