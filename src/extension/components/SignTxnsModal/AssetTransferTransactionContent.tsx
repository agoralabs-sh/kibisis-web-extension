import {
  Heading,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from '@extension/components/SignTxnsModal/SignTxnsAssetItem';
import SignTxnsLoadingItem from './SignTxnsLoadingItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Features
import { updateAssetInformationThunk } from '@extension/features/assets';

// Hooks
import useAccount from '@extension/hooks/useAccount';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAssetsByGenesisHash,
  useSelectLogger,
  useSelectPreferredBlockExplorer,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import {
  IAppThunkDispatch,
  IAsset,
  IExplorer,
  INativeCurrency,
  INetwork,
} from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { createIconFromDataUri } from '@extension/utils';

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
  const assetId: string = String(transaction.assetIndex);
  const fromAddress: string = encodeAddress(transaction.from.publicKey);
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const { account: fromAccount, fetching: fetchingAccountInformation } =
    useAccount({
      address: fromAddress,
      network,
    });
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const logger: ILogger = useSelectLogger();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const updating: boolean = useSelectUpdatingAssets();
  const [asset, setAsset] = useState<IAsset | null>(
    assets.find((value) => value.id === assetId) || null
  );
  const [standardUnitAmount, setStandardAmount] = useState<BigNumber>(
    new BigNumber('0')
  );
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  let assetIcon: ReactNode;

  // check if we have the asset information already, if not, dispatch the store to update
  useEffect(() => {
    const amount: BigNumber = new BigNumber(String(transaction.amount));
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
  // once the store has been updated with the asset information, update the asset and the amount
  useEffect(() => {
    const updatedAsset: IAsset | null =
      assets.find((value) => value.id === assetId) || null;

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

  if (updating || !asset || !fromAccount) {
    return (
      <VStack spacing={4} w="full">
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          w="full"
        >
          <Skeleton>
            <Heading size="lg" textAlign="center">
              {formatCurrencyUnit(standardUnitAmount)}
            </Heading>
          </Skeleton>
          <Skeleton>
            <AssetIcon
              color={primaryButtonTextColor}
              networkTheme={network.chakraTheme}
              h={3}
              w={3}
            />
          </Skeleton>
          <Skeleton>
            <Text color={defaultTextColor} fontSize="sm" textAlign="center">
              {assetId}
            </Text>
          </Skeleton>
        </HStack>
        <SignTxnsLoadingItem />
        <SignTxnsLoadingItem />
        <SignTxnsLoadingItem />
      </VStack>
    );
  }

  assetIcon = (
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
  );

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
          {assetIcon}
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {asset.unitName || asset.id}
          </Text>
        </HStack>
      </Tooltip>

      {/* From */}
      <SignTxnsAddressItem
        address={fromAddress}
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
        atomicUnitsAmount={
          new BigNumber(
            fromAccount.assets.find((value) => value.id === asset.id)?.amount ||
              '0'
          )
        }
        decimals={asset.decimals}
        displayUnit={true}
        icon={assetIcon}
        isLoading={fetchingAccountInformation}
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

      {/* Asset ID */}
      {asset.unitName && (
        <HStack spacing={0} w="full">
          <SignTxnsTextItem
            flexGrow={1}
            label={`${t<string>('labels.id')}:`}
            value={asset.id}
          />
          <CopyIconButton ariaLabel={`Copy ${asset.id}`} value={asset.id} />
          {explorer && (
            <OpenTabIconButton
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.assetPath}/${asset.id}`}
            />
          )}
        </HStack>
      )}

      {/* Note */}
      {transaction.note && transaction.note.length > 0 && (
        <SignTxnsTextItem
          label={`${t<string>('labels.note')}:`}
          value={new TextDecoder().decode(transaction.note)}
        />
      )}
    </VStack>
  );
};

export default AssetTransferTransactionContent;
