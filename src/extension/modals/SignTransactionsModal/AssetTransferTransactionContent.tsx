import { Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import ChainBadge from '@extension/components/ChainBadge';
import CopyIconButton from '@extension/components/CopyIconButton';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAssetTransactionBodyProps } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

const AssetTransferTransactionContent: FC<IAssetTransactionBodyProps> = ({
  accounts,
  asset,
  blockExplorer,
  condensed,
  fromAccount,
  hideNetwork = false,
  loading = false,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // states
  const [amountAsStandardUnit, setAmountAsStandardUnit] = useState<BigNumber>(
    new BigNumber('0')
  );
  const [balanceInAtomicUnits, setBalanceInAtomicUnits] =
    useState<BigNumber | null>();
  // misc
  const accountInformation = fromAccount
    ? AccountService.extractAccountInformationForNetwork(fromAccount, network)
    : null;
  const amountInAtomicUnits = new BigNumber(
    transaction.amount ? String(transaction.amount) : '0'
  );
  const feeInAtomicUnits = new BigNumber(
    transaction.fee ? String(transaction.fee) : '0'
  );
  // renders
  const renderExtraInformation = (icon: ReactNode) => {
    if (!asset) {
      return null;
    }

    return (
      <>
        {/*balance*/}
        {balanceInAtomicUnits && (
          <ModalAssetItem
            amountInAtomicUnits={balanceInAtomicUnits}
            decimals={asset.decimals}
            displayUnit={true}
            icon={icon}
            isLoading={loading}
            label={`${t<string>('labels.balance')}:`}
            unit={asset.unitName || undefined}
          />
        )}

        {/*fee*/}
        <ModalAssetItem
          amountInAtomicUnits={feeInAtomicUnits}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.symbol}
        />

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

          {blockExplorer && (
            <OpenTabIconButton
              size="xs"
              tooltipLabel={t<string>('captions.openOn', {
                name: blockExplorer.canonicalName,
              })}
              url={blockExplorer.assetURL(asset.id)}
            />
          )}
        </HStack>

        {/*network*/}
        {!hideNetwork && (
          <ModalItem
            label={`${t<string>('labels.network')}:`}
            value={<ChainBadge network={network} size="sm" />}
          />
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

  // once the store has been updated with the asset information, update the asset and the amount
  useEffect(() => {
    let _balanceInAtomicUnits: string | null;

    if (asset) {
      setAmountAsStandardUnit(
        convertToStandardUnit(amountInAtomicUnits, asset.decimals)
      );

      _balanceInAtomicUnits =
        accountInformation?.standardAssetHoldings.find(
          (value) => value.id === asset.id
        )?.amount || null;

      setBalanceInAtomicUnits(
        _balanceInAtomicUnits ? new BigNumber(_balanceInAtomicUnits) : null
      );
    }
  }, [asset]);

  if (loading || !asset || !fromAccount) {
    return (
      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={DEFAULT_GAP / 3}
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
      spacing={DEFAULT_GAP / 3}
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
          <ModalAssetItem
            amountInAtomicUnits={amountInAtomicUnits}
            decimals={asset.decimals}
            displayUnit={true}
            icon={assetIcon}
            isLoading={loading}
            label={`${t<string>('labels.amount')}:`}
            unit={asset.unitName || undefined}
          />
        </>
      ) : (
        <>
          {/*amount*/}
          <Tooltip
            aria-label="Asset amount with unrestricted decimals"
            label={`${amountAsStandardUnit.toString()} ${asset.unitName || ''}`}
          >
            <HStack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              w="full"
            >
              <Heading color={defaultTextColor} size="lg" textAlign="center">
                {formatCurrencyUnit(amountAsStandardUnit, {
                  decimals: asset.decimals,
                })}
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
      <ModalItem
        label={`${t<string>('labels.from')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={encodeAddress(transaction.from.publicKey)}
            ariaLabel="From address"
            size="sm"
            network={network}
          />
        }
      />

      {/*to*/}
      <ModalItem
        label={`${t<string>('labels.to')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={encodeAddress(transaction.to.publicKey)}
            ariaLabel="To address"
            size="sm"
            network={network}
          />
        }
      />

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={DEFAULT_GAP / 3} w="full">
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
