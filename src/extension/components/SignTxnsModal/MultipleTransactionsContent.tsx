import { Box, Text, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Features
import { updateAssetInformationThunk } from '@extension/features/assets';

// Selectors
import { useSelectAssetsByGenesisHash } from '@extension/selectors';

// Types
import {
  IAppThunkDispatch,
  IAsset,
  INativeCurrency,
  INetwork,
} from '@extension/types';

// Utils
import { computeGroupId } from '@common/utils';
import { createIconFromDataUri } from '@extension/utils';

interface IProps {
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transactions: Transaction[];
}

const MultipleTransactionsContent: FC<IProps> = ({
  nativeCurrency,
  network,
  transactions,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const borderColor: string = useBorderColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const computedGroupId: string = encodeBase64(computeGroupId(transactions));
  const renderContent = (transaction: Transaction) => {
    let asset: IAsset | null;

    switch (transaction.type) {
      case 'axfer':
        asset =
          assets.find((value) => value.id === String(transaction.assetIndex)) ||
          null;

        if (asset) {
          return (
            <>
              {/*Amount*/}
              <SignTxnsAssetItem
                atomicUnitsAmount={new BigNumber(String(transaction.amount))}
                decimals={asset.decimals}
                displayUnit={true}
                icon={
                  <AssetAvatar
                    asset={asset}
                    fallbackIcon={
                      <AssetIcon
                        color={primaryButtonTextColor}
                        networkTheme={network.chakraTheme}
                        h={3}
                        w={3}
                      />
                    }
                    size="2xs"
                  />
                }
                label={`${t<string>('labels.amount')}:`}
                unit={asset.unitName || undefined}
              />
              {/*Fee*/}
              <SignTxnsAssetItem
                atomicUnitsAmount={new BigNumber(String(transaction.fee))}
                decimals={nativeCurrency.decimals}
                icon={createIconFromDataUri(nativeCurrency.iconUri, {
                  color: subTextColor,
                  h: 3,
                  w: 3,
                })}
                label={`${t<string>('labels.fee')}:`}
                unit={nativeCurrency.code}
              />
            </>
          );
        }

        break;
      case 'pay':
        return (
          <>
            {/*Amount*/}
            <SignTxnsAssetItem
              atomicUnitsAmount={new BigNumber(String(transaction.amount))}
              decimals={nativeCurrency.decimals}
              displayUnit={true}
              icon={createIconFromDataUri(nativeCurrency.iconUri, {
                color: subTextColor,
                h: 3,
                w: 3,
              })}
              label={`${t<string>('labels.amount')}:`}
              unit={nativeCurrency.code}
            />
            {/*Fee*/}
            <SignTxnsAssetItem
              atomicUnitsAmount={new BigNumber(String(transaction.fee))}
              decimals={nativeCurrency.decimals}
              icon={createIconFromDataUri(nativeCurrency.iconUri, {
                color: subTextColor,
                h: 3,
                w: 3,
              })}
              label={`${t<string>('labels.fee')}:`}
              unit={nativeCurrency.code}
            />
          </>
        );
      default:
        break;
    }

    return null;
  };

  useEffect(() => {
    const unknownAssetIds: string[] = transactions
      .filter((value) => value.type === 'axfer')
      .filter(
        (transaction) =>
          !assets.some((value) => value.id === String(transaction.assetIndex))
      )
      .map((value) => String(value.assetIndex));

    // if we have some unknown assets, update the asset storage
    if (unknownAssetIds.length > 0) {
      dispatch(
        updateAssetInformationThunk({
          ids: unknownAssetIds,
          genesisHash: network.genesisHash,
        })
      );
    }
  }, []);

  return (
    <VStack spacing={4} w="full">
      {/*Group ID*/}
      <SignTxnsTextItem
        label={`${t<string>('labels.groupId')}:`}
        value={computedGroupId}
      />

      {/*Transactions*/}
      {transactions.map((transaction) => (
        <Box
          borderColor={borderColor}
          borderRadius="md"
          borderStyle="solid"
          borderWidth={1}
          key={nanoid()}
          px={4}
          py={2}
          w="full"
        >
          <Text color={defaultTextColor} fontSize="md" textAlign="left">
            {t<string>('headings.transaction', {
              context: transaction.type,
            })}
          </Text>
          {renderContent(transaction)}
        </Box>
      ))}
    </VStack>
  );
};

export default MultipleTransactionsContent;
