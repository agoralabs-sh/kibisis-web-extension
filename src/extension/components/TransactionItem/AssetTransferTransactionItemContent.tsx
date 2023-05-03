import { HStack, Skeleton, Spacer, Text, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';

// Hooks
import useAsset from '@extension/hooks/useAsset';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Services
import { AccountService } from '@extension/services';

// Types
import {
  IAccount,
  IAssetTransferTransaction,
  INetwork,
} from '@extension/types';

interface IProps {
  account: IAccount;
  network: INetwork;
  transaction: IAssetTransferTransaction;
}

const AssetTransferTransactionItemContent: FC<IProps> = ({
  account,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const { asset, updating } = useAsset(transaction.assetId);
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const accountAddress: string =
    AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
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
          address={transaction.sender}
          color={subTextColor}
          fontSize="xs"
          network={network}
        />
      </VStack>

      <Spacer />

      <VStack alignItems="flex-end" justifyContent="center" spacing={2}>
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
            color={
              amount.lte(0)
                ? defaultTextColor
                : transaction.receiver === accountAddress
                ? 'green.500'
                : 'red.500'
            }
            decimals={asset.decimals}
            displayUnit={true}
            fontSize="sm"
            prefix={
              amount.lte(0)
                ? undefined
                : transaction.receiver === accountAddress
                ? '+'
                : '-'
            }
            unit={asset.unitName || undefined}
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
