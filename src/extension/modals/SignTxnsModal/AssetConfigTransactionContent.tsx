import { HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsChangeAddressItem from './SignTxnsChangeAddressItem';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import {
  IAccount,
  IStandardAsset,
  IExplorer,
  INetwork,
} from '@extension/types';
import { ICondensedProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';
import Warning from '@extension/components/Warning';

interface IProps {
  asset: IStandardAsset | null;
  condensed?: ICondensedProps;
  explorer: IExplorer;
  fromAccount: IAccount | null;
  loading?: boolean;
  network: INetwork;
  transaction: Transaction;
}

const AssetConfigTransactionContent: FC<IProps> = ({
  asset,
  condensed,
  explorer,
  fromAccount,
  loading = false,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const fromAddress: string = encodeAddress(transaction.from.publicKey);
  const transactionType: TransactionTypeEnum = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: fromAccount,
    }
  );
  const renderExtraInformation = (icon: ReactNode) => {
    if (!asset) {
      return null;
    }

    return (
      <>
        {/*fee*/}
        <SignTxnsAssetItem
          atomicUnitAmount={new BigNumber(String(transaction.fee))}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.symbol}
        />

        {transactionType === TransactionTypeEnum.AssetConfig && (
          <>
            {/*clawback address*/}
            {transaction.assetClawback && asset.clawbackAddress && (
              <SignTxnsChangeAddressItem
                ariaLabel="The current and new clawback addresses"
                currentAddress={asset.clawbackAddress}
                label={`${t<string>('labels.clawbackAccount')}:`}
                network={network}
                newAddress={encodeAddress(transaction.assetClawback.publicKey)}
              />
            )}

            {/*freeze address*/}
            {transaction.assetFreeze && asset.freezeAddress && (
              <SignTxnsChangeAddressItem
                ariaLabel="The current and new freeze addresses"
                currentAddress={asset.freezeAddress}
                label={`${t<string>('labels.freezeAccount')}:`}
                network={network}
                newAddress={encodeAddress(transaction.assetFreeze.publicKey)}
              />
            )}

            {/*manager address*/}
            {transaction.assetManager && asset.managerAddress && (
              <SignTxnsChangeAddressItem
                ariaLabel="The current and new manager addresses"
                currentAddress={asset.managerAddress}
                label={`${t<string>('labels.managerAccount')}:`}
                network={network}
                newAddress={encodeAddress(transaction.assetManager.publicKey)}
              />
            )}

            {/*reserve address*/}
            {transaction.assetReserve && asset.reserveAddress && (
              <SignTxnsChangeAddressItem
                ariaLabel="The current and new reserve addresses"
                currentAddress={asset.reserveAddress}
                label={`${t<string>('labels.reserveAccount')}:`}
                network={network}
                newAddress={encodeAddress(transaction.assetReserve.publicKey)}
              />
            )}
          </>
        )}

        {transactionType === TransactionTypeEnum.AssetDestroy && (
          <>
            {/*total supply*/}
            <SignTxnsAssetItem
              atomicUnitAmount={new BigNumber(asset.total)}
              decimals={asset.decimals}
              displayUnit={true}
              icon={icon}
              isLoading={loading}
              label={`${t<string>('labels.totalSupply')}:`}
              unit={asset.unitName || undefined}
            />
          </>
        )}

        {/*note*/}
        {transaction.note && transaction.note.length > 0 && (
          <ModalTextItem
            isCode={true}
            label={`${t<string>('labels.note')}:`}
            value={new TextDecoder().decode(transaction.note)}
          />
        )}
      </>
    );
  };
  let assetIcon: ReactNode;

  if (loading || !fromAccount || !asset) {
    return (
      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={2}
        w="full"
      >
        <ModalSkeletonItem />
        <ModalSkeletonItem />
        <ModalSkeletonItem />
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
      {/*heading*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
        {t<string>('headings.transaction', {
          context: transactionType,
        })}
      </Text>

      {transactionType === TransactionTypeEnum.AssetDestroy && (
        <Warning message={t<string>('captions.destroyAsset')} size="xs" />
      )}

      {/*asset name*/}
      {asset.name && (
        <ModalTextItem
          label={`${t<string>('labels.name')}:`}
          value={asset.name}
        />
      )}

      {/*asset id*/}
      <HStack spacing={0} w="full">
        <ModalTextItem
          flexGrow={1}
          isCode={true}
          label={`${t<string>('labels.id')}:`}
          value={asset.id}
        />
        <CopyIconButton
          ariaLabel={t<string>('labels.copyValue', { value: asset.id })}
          tooltipLabel={t<string>('labels.copyValue', { value: asset.id })}
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

      {/*manager*/}
      {fromAddress !== asset.managerAddress ? (
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          w="full"
        >
          <SignTxnsAddressItem
            address={fromAddress}
            ariaLabel="Manager address (from)"
            label={`${t<string>('labels.managerAccount')}:`}
            network={network}
          />
          <Tooltip
            aria-label="Manager address does not match the asset's manager address"
            label={t<string>('captions.managerAddressDoesNotMatch')}
          >
            <span
              style={{
                height: '1em',
                lineHeight: '1em',
              }}
            >
              <Icon as={IoWarningOutline} color="yellow.500" />
            </span>
          </Tooltip>
        </HStack>
      ) : (
        <SignTxnsAddressItem
          address={fromAddress}
          ariaLabel="Manager address (from)"
          label={`${t<string>('labels.managerAccount')}:`}
          network={network}
        />
      )}

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

export default AssetConfigTransactionContent;
