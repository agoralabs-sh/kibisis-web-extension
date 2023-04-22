import {
  Heading,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Algodv2, encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from '@extension/components/SignTxnsModal/SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Features
import { fetchAccountInformationWithDelay } from '@extension/features/accounts';
import {
  fetchAssetInformationById,
  updateAssetInformationThunk,
} from '@extension/features/assets';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAssetsByGenesisHash,
  useSelectLogger,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import {
  IAlgorandAccountInformation,
  IAlgorandAssetHolding,
  IAppThunkDispatch,
  IAsset,
  INativeCurrency,
  INetwork,
  INode,
} from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { createIconFromDataUri, randomNode } from '@extension/utils';

interface IProps {
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transaction: Transaction;
}

const AssetTransferTransactionContent: FC<IProps> = ({
  nativeCurrency,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const logger: ILogger = useSelectLogger();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const updating: boolean = useSelectUpdatingAssets();
  const [asset, setAsset] = useState<IAsset | null>(
    assets.find((value) => value.id === String(transaction.assetIndex)) || null
  );
  const [fromBalance, setFromBalance] = useState<BigNumber>(new BigNumber('0'));
  const [standardUnitAmount, setStandardAmount] = useState<BigNumber>(
    new BigNumber('0')
  );

  // check if we have the asset information already, if not, dispatch the store to update
  useEffect(() => {
    const amount: BigNumber = new BigNumber(String(transaction.amount));
    const assetId: string = String(transaction.assetIndex);
    const transactionAsset: IAsset | null =
      assets.find((value) => value.id === assetId) || null;

    if (!transactionAsset) {
      logger.debug(
        `${AssetTransferTransactionContent.name}#${useEffect.name}(): asset "${assetId}" not known updating information`
      );

      dispatch(
        updateAssetInformationThunk({
          ids: [assetId],
          genesisHash: network.genesisHash,
        })
      );

      return;
    }

    setAsset(transactionAsset);
    setStandardAmount(convertToStandardUnit(amount, transactionAsset.decimals));
  }, []);
  // fetch the latest account balance for the particular asset
  useEffect(() => {
    (async () => {
      const node: INode = randomNode(network);
      const accountInformation: IAlgorandAccountInformation =
        await fetchAccountInformationWithDelay({
          address: encodeAddress(transaction.from.publicKey),
          delay: 0,
          client: new Algodv2('', node.url, node.port),
        });
      const assetHolding: IAlgorandAssetHolding | null =
        accountInformation.assets.find(
          (value) =>
            String(value['asset-id']) === String(transaction.assetIndex)
        ) || null;

      if (assetHolding) {
        setFromBalance(new BigNumber(String(assetHolding.amount)));
      }
    })();
  }, []);
  // once the store has been updated with the asset information, update the asset and the amount
  useEffect(() => {
    const updatedAsset: IAsset | null =
      assets.find((value) => value.id === String(transaction.assetIndex)) ||
      null;

    if (updatedAsset) {
      setAsset(updatedAsset);
      setStandardAmount(
        convertToStandardUnit(
          new BigNumber(String(transaction.amount)),
          updatedAsset.decimals
        )
      );
    }
  }, [assets]);

  if (updating || !asset) {
    return (
      <VStack spacing={4} w="full">
        <Skeleton>
          <Heading size="lg" textAlign="center">
            {formatCurrencyUnit(standardUnitAmount)}
          </Heading>
        </Skeleton>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} w="full">
      {/* Amount */}
      <Tooltip
        aria-label="Asset amount with unrestricted decimals"
        label={`${standardUnitAmount.toString()}${
          asset.unitName ? ` ${asset.unitName}` : ''
        }`}
      >
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          w="full"
        >
          <Heading color={defaultTextColor} size="lg" textAlign="center">
            {formatCurrencyUnit(standardUnitAmount)}
          </Heading>
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
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {asset.unitName || asset.id}
          </Text>
        </HStack>
      </Tooltip>

      {/* From */}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.from.publicKey)}
        ariaLabel="From address"
        label={`${t<string>('labels.from')}:`}
      />

      {/* To */}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.to.publicKey)}
        ariaLabel="To address"
        label={`${t<string>('labels.to')}:`}
      />

      {/* Balance */}
      <SignTxnsAssetItem
        atomicUnitsAmount={fromBalance}
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
        label={`${t<string>('labels.balance')}:`}
        unit={asset.unitName || undefined}
      />

      {/* Fee */}
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

      {/* Note */}
      {transaction.note && (
        <SignTxnsTextItem
          label={`${t<string>('labels.note')}:`}
          value={new TextDecoder().decode(transaction.note)}
        />
      )}
    </VStack>
  );
};

export default AssetTransferTransactionContent;
