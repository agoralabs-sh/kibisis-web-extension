import { VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import Warning from '@extension/components/Warning';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useMinimumBalanceRequirementsForTransactions from '@extension/hooks/useMinimumBalanceRequirementsForTransactions';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { ISendAssetModalSummaryContentProps } from './types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';

const SendAssetModalSummaryContent: FC<ISendAssetModalSummaryContentProps> = ({
  accounts,
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
  const renderAssetItem = () => {
    const label = `${t<string>('labels.amount')}:`;

    switch (asset.type) {
      case AssetTypeEnum.ARC0200:
        return (
          <ModalAssetItem
            amountInAtomicUnits={amountInAtomicUnits}
            decimals={asset.decimals}
            displayUnit={true}
            icon={
              <AssetAvatar
                asset={asset}
                fallbackIcon={
                  <AssetIcon
                    color={primaryButtonTextColor}
                    networkTheme={network.chakraTheme}
                    boxSize={calculateIconSize('xs')}
                  />
                }
                size="2xs"
              />
            }
            label={label}
            unit={asset.symbol}
          />
        );
      case AssetTypeEnum.Native:
        return (
          <ModalAssetItem
            amountInAtomicUnits={amountInAtomicUnits}
            decimals={asset.decimals}
            displayUnit={false}
            icon={createIconFromDataUri(asset.iconUrl, {
              color: subTextColor,
              boxSize: calculateIconSize('xs'),
            })}
            label={label}
            unit={asset.symbol}
          />
        );
      case AssetTypeEnum.Standard:
        return (
          <ModalAssetItem
            amountInAtomicUnits={amountInAtomicUnits}
            decimals={asset.decimals}
            displayUnit={true}
            icon={
              <AssetAvatar
                asset={asset}
                fallbackIcon={
                  <AssetIcon
                    color={primaryButtonTextColor}
                    networkTheme={network.chakraTheme}
                    boxSize={calculateIconSize('xs')}
                  />
                }
                size="2xs"
              />
            }
            label={label}
            {...(asset.unitName && {
              unit: asset.unitName,
            })}
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
      <ModalAssetItem
        amountInAtomicUnits={extraPaymentInAtomicUnits}
        decimals={network.nativeCurrency.decimals}
        displayUnit={false}
        icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
          color: subTextColor,
          boxSize: calculateIconSize('xs'),
        })}
        label={`${t<string>('labels.extraPayment')}:`}
        unit={network.nativeCurrency.symbol}
        warningLabel={t<string>('captions.extraPayment', {
          symbol: asset.symbol,
        })}
      />
    );
  };

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={DEFAULT_GAP / 3}
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
      {renderAssetItem()}

      {/*from account*/}
      <ModalItem
        label={`${t<string>('labels.from')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={convertPublicKeyToAVMAddress(fromAccount.publicKey)}
            size="sm"
            network={network}
          />
        }
      />

      {/*to address*/}
      <ModalItem
        label={`${t<string>('labels.to')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={toAddress}
            size="sm"
            network={network}
          />
        }
      />

      {/*type*/}
      {asset.type !== AssetTypeEnum.Native && (
        <ModalItem
          label={`${t<string>('labels.type')}:`}
          value={<AssetBadge type={asset.type} />}
        />
      )}

      {/*fee*/}
      <ModalAssetItem
        amountInAtomicUnits={totalFee}
        decimals={network.nativeCurrency.decimals}
        displayUnit={false}
        icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
          color: subTextColor,
          boxSize: calculateIconSize('xs'),
        })}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.symbol}
        {...(asset.type === AssetTypeEnum.ARC0200 &&
          transactions.length > 1 && {
            warningLabel: t<string>('captions.higherFee', {
              symbol: asset.symbol,
            }),
          })}
      />

      {/*extra payment*/}
      {renderExtraPaymentItem()}

      {/*note*/}
      {note && note.length > 0 && (
        <ModalTextItem
          isCode={true}
          label={`${t<string>('labels.note')}:`}
          value={note}
        />
      )}
    </VStack>
  );
};

export default SendAssetModalSummaryContent;
