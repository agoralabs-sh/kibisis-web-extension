import { HStack, Text, Tooltip, useDisclosure, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem, { ITEM_HEIGHT } from '@extension/components/PageItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import {
  IExplorer,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import AssetDisplay from '@extension/components/AssetDisplay';
import { createIconFromDataUri } from '@extension/utils';

interface IProps {
  asset: IStandardAsset;
  explorer: IExplorer | null;
  network: INetworkWithTransactionParams;
}

const AddAssetModalStandardAssetSummaryContent: FC<IProps> = ({
  asset,
  explorer,
  network,
}: IProps) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      <VStack
        alignItems="center"
        justifyContent="flex-start"
        spacing={1}
        w="full"
      >
        {/*asset icon*/}
        <AssetAvatar
          asset={asset}
          fallbackIcon={
            <AssetIcon
              color={primaryButtonTextColor}
              networkTheme={network.chakraTheme}
              h={6}
              w={6}
            />
          }
          size="md"
        />

        {/*unit*/}
        {asset.unitName && (
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {asset.unitName}
          </Text>
        )}

        <VStack
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          {/*asset id*/}
          <PageItem fontSize="sm" label={t<string>('labels.applicationId')}>
            <HStack spacing={0}>
              <Text color={subTextColor} fontSize="sm">
                {asset.id}
              </Text>

              <CopyIconButton
                ariaLabel="Copy ARC200 application ID"
                copiedTooltipLabel={t<string>(
                  'captions.arc200ApplicationIdCopied'
                )}
                size="sm"
                value={asset.id}
              />

              {explorer && (
                <OpenTabIconButton
                  size="sm"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.applicationPath}/${asset.id}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*name*/}
          {asset.name && (
            <PageItem fontSize="sm" label={t<string>('labels.name')}>
              <Tooltip aria-label="Asset full name" label={asset.name}>
                <Text
                  color={subTextColor}
                  fontSize="sm"
                  maxW={150}
                  noOfLines={1}
                >
                  {asset.name}
                </Text>
              </Tooltip>
            </PageItem>
          )}

          {/*type*/}
          <PageItem fontSize="sm" label={t<string>('labels.type')}>
            <AssetBadge type={AssetTypeEnum.Standard} />
          </PageItem>

          {/*fee*/}
          <PageItem fontSize="sm" label={t<string>('labels.fee')}>
            <HStack spacing={1}>
              <AssetDisplay
                atomicUnitAmount={new BigNumber(network.minFee)}
                amountColor={subTextColor}
                decimals={network.nativeCurrency.decimals}
                fontSize="sm"
                icon={createIconFromDataUri(network.nativeCurrency.iconUri, {
                  color: subTextColor,
                  h: 3,
                  w: 3,
                })}
                unit={network.nativeCurrency.code}
              />

              <InfoIconTooltip
                color={subTextColor}
                label={t<string>('captions.optInFee')}
              />
            </HStack>
          </PageItem>

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="sm"
            isOpen={isOpen}
            minButtonHeight={ITEM_HEIGHT}
            onChange={handleMoreInformationToggle}
          >
            <VStack spacing={DEFAULT_GAP - 2} w="full">
              {/*decimals*/}
              <PageItem fontSize="sm" label={t<string>('labels.decimals')}>
                <Text color={subTextColor} fontSize="sm">
                  {asset.decimals.toString()}
                </Text>
              </PageItem>

              {/*total supply*/}
              <PageItem fontSize="sm" label={t<string>('labels.totalSupply')}>
                <Tooltip
                  aria-label="Asset amount with unrestricted decimals"
                  label={convertToStandardUnit(
                    new BigNumber(asset.total),
                    asset.decimals
                  ).toString()}
                >
                  <Text color={subTextColor} fontSize="sm">
                    {formatCurrencyUnit(
                      convertToStandardUnit(
                        new BigNumber(asset.total),
                        asset.decimals
                      ),
                      asset.decimals
                    )}
                  </Text>
                </Tooltip>
              </PageItem>
            </VStack>
          </MoreInformationAccordion>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default AddAssetModalStandardAssetSummaryContent;
