import { Code, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetDisplay from '@extension/components/AssetDisplay';
import AssetIcon from '@extension/components/AssetIcon';
import SendAssetSummaryItem from './SendAssetSummaryItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import { AccountService } from '@extension/services';

// types
import {
  IAccount,
  IArc200Asset,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';

// utils
import { createIconFromDataUri } from '@extension/utils';
import { convertToAtomicUnit } from '@common/utils';

interface IProps {
  amountInStandardUnits: string;
  asset: IArc200Asset | IStandardAsset;
  fromAccount: IAccount;
  network: INetworkWithTransactionParams;
  note: string | null;
  toAddress: string;
}

const SendAssetModalSummaryContent: FC<IProps> = ({
  amountInStandardUnits,
  asset,
  fromAccount,
  network,
  note,
  toAddress,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // renders
  const renderAssetDisplay = () => {
    switch (asset.type) {
      case AssetTypeEnum.Arc200:
        return (
          <AssetDisplay
            atomicUnitAmount={convertToAtomicUnit(
              new BigNumber(amountInStandardUnits),
              asset.decimals
            )}
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
      case AssetTypeEnum.Standard:
        return (
          <AssetDisplay
            atomicUnitAmount={convertToAtomicUnit(
              new BigNumber(amountInStandardUnits),
              asset.decimals
            )}
            amountColor={subTextColor}
            decimals={asset.decimals}
            displayUnit={asset.id !== '0'}
            fontSize="sm"
            icon={
              asset.id === '0' ? (
                createIconFromDataUri(network.nativeCurrency.iconUrl, {
                  color: subTextColor,
                  h: 3,
                  w: 3,
                })
              ) : (
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
              )
            }
            unit={asset.unitName || undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
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
      <SendAssetSummaryItem
        fontSize="sm"
        item={<AssetBadge type={asset.type} />}
        label={t<string>('labels.type')}
      />

      {/*fee*/}
      {asset.type === AssetTypeEnum.Standard && (
        <SendAssetSummaryItem
          fontSize="sm"
          item={
            <AssetDisplay
              atomicUnitAmount={new BigNumber(network.minFee)}
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
          }
          label={t<string>('labels.fee')}
        />
      )}

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
