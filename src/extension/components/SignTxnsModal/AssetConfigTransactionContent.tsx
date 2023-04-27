import { HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsChangeAddressItem from './SignTxnsChangeAddressItem';
import SignTxnsLoadingItem from './SignTxnsLoadingItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { IAccount, IAsset, IExplorer, INetwork } from '@extension/types';
import { ICondensedProps } from './types';

// Utils
import { createIconFromDataUri, parseTransactionType } from '@extension/utils';
import Warning from '@extension/components/Warning';

interface IProps {
  asset: IAsset | null;
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
    transaction,
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
          atomicUnitsAmount={new BigNumber(String(transaction.fee))}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUri, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.code}
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
              atomicUnitsAmount={new BigNumber(asset.total)}
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

  if (loading || !fromAccount || !asset) {
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
        <SignTxnsTextItem
          label={`${t<string>('labels.name')}:`}
          value={asset.name}
        />
      )}

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
