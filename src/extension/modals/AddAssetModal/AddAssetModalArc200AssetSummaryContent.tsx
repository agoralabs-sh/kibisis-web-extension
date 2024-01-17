import { HStack, Text, Tooltip, useDisclosure, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
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
  IArc200Asset,
  IExplorer,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';

interface IProps {
  asset: IArc200Asset;
  explorer: IExplorer | null;
  network: INetworkWithTransactionParams;
}

const AddAssetModalArc200AssetSummaryContent: FC<IProps> = ({
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
  // misc
  const totalSupplyInStandardUnits: BigNumber = convertToStandardUnit(
    new BigNumber(asset.totalSupply),
    asset.decimals
  );
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

        {/*symbol*/}
        <Tooltip aria-label="ARC200 asset symbol" label={asset.symbol}>
          <Text
            color={defaultTextColor}
            fontSize="md"
            maxW={200}
            noOfLines={1}
            textAlign="center"
          >
            {asset.symbol}
          </Text>
        </Tooltip>

        <VStack
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          {/*application id*/}
          <PageItem fontSize="sm" label={t<string>('labels.applicationId')}>
            <HStack spacing={0}>
              <Text color={subTextColor} fontSize="sm">
                {asset.id}
              </Text>

              <CopyIconButton
                ariaLabel={t<string>('labels.copyApplicationId')}
                tooltipLabel={t<string>('labels.copyApplicationId')}
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
          <PageItem fontSize="sm" label={t<string>('labels.name')}>
            <Tooltip aria-label="Asset full name" label={asset.name}>
              <Text color={subTextColor} fontSize="sm" maxW={150} noOfLines={1}>
                {asset.name}
              </Text>
            </Tooltip>
          </PageItem>

          {/*type*/}
          <PageItem fontSize="sm" label={t<string>('labels.type')}>
            <AssetBadge type={AssetTypeEnum.Arc200} />
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
                  label={formatCurrencyUnit(totalSupplyInStandardUnits, {
                    decimals: asset.decimals,
                    thousandSeparatedOnly: true,
                  })}
                >
                  <Text color={subTextColor} fontSize="sm">
                    {formatCurrencyUnit(
                      convertToStandardUnit(
                        new BigNumber(asset.totalSupply),
                        asset.decimals
                      ),
                      { decimals: asset.decimals }
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

export default AddAssetModalArc200AssetSummaryContent;
