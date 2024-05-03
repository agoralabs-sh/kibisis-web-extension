import { Code, HStack, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetDisplay from '@extension/components/AssetDisplay';
import AssetIcon from '@extension/components/AssetIcon';
import Warning from '@extension/components/Warning';
import WarningIcon from '@extension/components/WarningIcon';
import SendAssetSummaryItem from './SendAssetSummaryItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useMinimumBalanceRequirementsForTransactions from '@extension/hooks/useMinimumBalanceRequirementsForTransactions';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { SendAssetModalSummaryContentProps } from './types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';

const SendAssetModalSummaryContent: FC<SendAssetModalSummaryContentProps> = ({
  amountInStandardUnits,
  asset,
  fromAccount,
  network,
  note,
  toAddress,
  transactions,
}) => {
  const { t } = useTranslation();
  // hooks
  const {
    accountBalanceInAtomicUnits,
    minimumBalanceRequirementInAtomicUnits,
    totalCostInAtomicUnits,
  } = useMinimumBalanceRequirementsForTransactions({
    account: fromAccount,
    network,
    transactions,
  });
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const amountInAtomicUnits = convertToAtomicUnit(
    new BigNumber(amountInStandardUnits),
    asset.decimals
  );
  const isBelowMinimumBalance = accountBalanceInAtomicUnits
    .minus(totalCostInAtomicUnits)
    .lt(minimumBalanceRequirementInAtomicUnits);
  const totalFee = new BigNumber(
    transactions.reduce((acc, value) => acc + value.fee, 0)
  );
  // renders
  const renderAssetDisplay = () => {
    switch (asset.type) {
      case AssetTypeEnum.ARC0200:
        return (
          <AssetDisplay
            atomicUnitAmount={amountInAtomicUnits}
            amountColor={subTextColor}
            decimals={asset.decimals}
            displayUnit={true}
            fontSize="sm"
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
            unit={asset.symbol}
          />
        );
      case AssetTypeEnum.Native:
        return (
          <AssetDisplay
            atomicUnitAmount={amountInAtomicUnits}
            amountColor={subTextColor}
            decimals={asset.decimals}
            displayUnit={false}
            fontSize="sm"
            icon={createIconFromDataUri(asset.iconUrl, {
              color: subTextColor,
              h: 3,
              w: 3,
            })}
            unit={asset.symbol}
          />
        );
      case AssetTypeEnum.Standard:
        return (
          <AssetDisplay
            atomicUnitAmount={amountInAtomicUnits}
            amountColor={subTextColor}
            decimals={asset.decimals}
            displayUnit={true}
            fontSize="sm"
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
            unit={asset.unitName || undefined}
          />
        );
      default:
        return null;
    }
  };
  const renderExtraPaymentItem = () => {
    let extraPaymentInAtomicUnits: BigNumber;

    // only arc0200 with one-time box storage will need to show extra payment
    if (asset.type !== AssetTypeEnum.ARC0200 || transactions.length <= 1) {
      return null;
    }

    // get all the payment transactions
    extraPaymentInAtomicUnits = new BigNumber(
      String(
        transactions.reduce(
          (acc, value) =>
            value.type === 'pay' ? (value.amount as bigint) + acc : acc,
          BigInt(0)
        )
      )
    );

    return (
      <SendAssetSummaryItem
        fontSize="sm"
        item={
          <HStack spacing={2}>
            <AssetDisplay
              atomicUnitAmount={extraPaymentInAtomicUnits}
              amountColor={subTextColor}
              decimals={network.nativeCurrency.decimals}
              fontSize="sm"
              icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
                color: subTextColor,
                h: 3,
                w: 3,
              })}
              unit={network.nativeCurrency.symbol}
            />

            <WarningIcon
              tooltipLabel={t<string>('captions.extraPayment', {
                symbol: asset.symbol,
              })}
            />
          </HStack>
        }
        label={t<string>('labels.extraPayment')}
      />
    );
  };

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      {isBelowMinimumBalance && (
        <Warning
          message={t<string>('captions.minimumBalanceTooLow', {
            balance: formatCurrencyUnit(
              convertToStandardUnit(
                accountBalanceInAtomicUnits,
                network.nativeCurrency.decimals
              ),
              {
                decimals: network.nativeCurrency.decimals,
              }
            ),
            cost: formatCurrencyUnit(
              convertToStandardUnit(
                minimumBalanceRequirementInAtomicUnits.plus(
                  totalCostInAtomicUnits
                ),
                network.nativeCurrency.decimals
              ),
              {
                decimals: network.nativeCurrency.decimals,
              }
            ),
            symbol: network.nativeCurrency.symbol,
          })}
          size="sm"
        />
      )}

      {/*amount/asset*/}
      <SendAssetSummaryItem
        fontSize="sm"
        item={renderAssetDisplay()}
        label={t<string>('labels.amount')}
      />

      {/*from account*/}
      <SendAssetSummaryItem
        fontSize="sm"
        item={
          <AddressDisplay
            address={AccountService.convertPublicKeyToAlgorandAddress(
              fromAccount.publicKey
            )}
            ariaLabel="From address"
            color={subTextColor}
            fontSize="sm"
            network={network}
          />
        }
        label={t<string>('labels.from')}
      />

      {/*to address*/}
      <SendAssetSummaryItem
        fontSize="sm"
        item={
          <AddressDisplay
            address={toAddress}
            ariaLabel="To address"
            color={subTextColor}
            fontSize="sm"
            network={network}
          />
        }
        label={t<string>('labels.to')}
      />

      {/*type*/}
      {asset.type !== AssetTypeEnum.Native && (
        <SendAssetSummaryItem
          fontSize="sm"
          item={<AssetBadge type={asset.type} />}
          label={t<string>('labels.type')}
        />
      )}

      {/*fee*/}
      <SendAssetSummaryItem
        fontSize="sm"
        item={
          <HStack spacing={2}>
            <AssetDisplay
              atomicUnitAmount={totalFee}
              amountColor={subTextColor}
              decimals={network.nativeCurrency.decimals}
              fontSize="sm"
              icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
                color: subTextColor,
                h: 3,
                w: 3,
              })}
              unit={network.nativeCurrency.symbol}
            />

            {/*show a warning for higher arc0200 fees for one-time box storage*/}
            {asset.type === AssetTypeEnum.ARC0200 &&
              transactions.length > 1 && (
                <WarningIcon
                  tooltipLabel={t<string>('captions.higherFee', {
                    symbol: asset.symbol,
                  })}
                />
              )}
          </HStack>
        }
        label={t<string>('labels.fee')}
      />

      {/*extra payment*/}
      {renderExtraPaymentItem()}

      {/*note*/}
      {note && note.length > 0 && (
        <SendAssetSummaryItem
          fontSize="sm"
          item={
            <Code borderRadius="md" fontSize="sm" wordBreak="break-word">
              {note}
            </Code>
          }
          label={t<string>('labels.note')}
        />
      )}
    </VStack>
  );
};

export default SendAssetModalSummaryContent;
