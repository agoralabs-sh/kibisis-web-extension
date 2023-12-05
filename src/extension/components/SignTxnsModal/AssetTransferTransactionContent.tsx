import { Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsLoadingItem from './SignTxnsLoadingItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import { IAccount, IAsset, IExplorer, INetwork } from '@extension/types';
import { ICondensedProps } from './types';

// utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { createIconFromDataUri, parseTransactionType } from '@extension/utils';

interface IProps {
  asset: IAsset | null;
  condensed?: ICondensedProps;
  explorer: IExplorer;
  fromAccount: IAccount | null;
  loading?: boolean;
  network: INetwork;
  transaction: Transaction;
}

const AssetTransferTransactionContent: FC<IProps> = ({
  asset,
  condensed,
  explorer,
  fromAccount,
  loading = false,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const [standardUnitAmount, setStandardAmount] = useState<BigNumber>(
    new BigNumber('0')
  );
  const atomicUintAmount: BigNumber = new BigNumber(
    transaction.amount ? String(transaction.amount) : '0'
  );
  const renderExtraInformation = (icon: ReactNode) => {
    if (!asset) {
      return null;
    }

    return (
      <>
        {/*balance*/}
        <SignTxnsAssetItem
          atomicUnitAmount={atomicUintAmount}
          decimals={asset.decimals}
          displayUnit={true}
          icon={icon}
          isLoading={loading}
          label={`${t<string>('labels.balance')}:`}
          unit={asset.unitName || undefined}
        />

        {/*fee*/}
        <SignTxnsAssetItem
          atomicUnitAmount={new BigNumber(String(transaction.fee))}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUri, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.code}
        />

        {/*asset id*/}
        <HStack spacing={0} w="full">
          <SignTxnsTextItem
            flexGrow={1}
            isCode={true}
            label={`${t<string>('labels.id')}:`}
            value={asset.id}
          />
          <CopyIconButton
            ariaLabel={`Copy ${asset.id}`}
            size="xs"
            value={asset.id}
          />
          {explorer && (
            <OpenTabIconButton
              size="xs"
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.assetPath}/${asset.id}`}
            />
          )}
        </HStack>

        {/*note*/}
        {transaction.note && transaction.note.length > 0 && (
          <SignTxnsTextItem
            isCode={true}
            label={`${t<string>('labels.note')}:`}
            value={new TextDecoder().decode(transaction.note)}
          />
        )}
      </>
    );
  };
  let assetIcon: ReactNode;

  // once the store has been updated with the asset information, update the asset and the amount
  useEffect(() => {
    if (asset) {
      setStandardAmount(
        convertToStandardUnit(atomicUintAmount, asset.decimals)
      );
    }
  }, [asset]);

  if (loading || !asset || !fromAccount) {
    return (
      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={2}
        w="full"
      >
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
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={condensed ? 2 : 4}
      w="full"
    >
      {condensed ? (
        <>
          {/*heading*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="left"
            w="full"
          >
            {t<string>('headings.transaction', {
              context: parseTransactionType(
                transaction.get_obj_for_encoding(),
                {
                  network,
                  sender: fromAccount,
                }
              ),
            })}
          </Text>

          {/*amount*/}
          <SignTxnsAssetItem
            atomicUnitAmount={atomicUintAmount}
            decimals={asset.decimals}
            displayUnit={true}
            icon={assetIcon}
            label={`${t<string>('labels.amount')}:`}
            unit={asset.unitName || undefined}
          />
        </>
      ) : (
        <>
          {/*amount*/}
          <Tooltip
            aria-label="Asset amount with unrestricted decimals"
            label={`${standardUnitAmount.toString()} ${asset.unitName || ''}`}
          >
            <HStack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              w="full"
            >
              <Heading color={defaultTextColor} size="lg" textAlign="center">
                {formatCurrencyUnit(standardUnitAmount, asset.decimals)}
              </Heading>

              {assetIcon}

              <Text color={defaultTextColor} fontSize="sm" textAlign="center">
                {asset.unitName || asset.id}
              </Text>
            </HStack>
          </Tooltip>

          {/*heading*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="left"
            w="full"
          >
            {t<string>('headings.transaction', {
              context: parseTransactionType(
                transaction.get_obj_for_encoding(),
                {
                  network,
                  sender: fromAccount,
                }
              ),
            })}
          </Text>
        </>
      )}

      {/*from*/}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.from.publicKey)}
        ariaLabel="From address"
        label={`${t<string>('labels.from')}:`}
        network={network}
      />

      {/*to*/}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.to.publicKey)}
        ariaLabel="To address"
        label={`${t<string>('labels.to')}:`}
        network={network}
      />

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={2} w="full">
            {renderExtraInformation(assetIcon)}
          </VStack>
        </MoreInformationAccordion>
      ) : (
        renderExtraInformation(assetIcon)
      )}
    </VStack>
  );
};

export default AssetTransferTransactionContent;
