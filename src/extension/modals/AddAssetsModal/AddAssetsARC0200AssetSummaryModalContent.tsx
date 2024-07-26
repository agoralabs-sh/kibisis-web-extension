import { HStack, Text, Tooltip, useDisclosure, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';

// types
import type { IAddAssetsARC0200SummaryModalContentProps } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';

const AddAssetsARC0200AssetSummaryModalContent: FC<
  IAddAssetsARC0200SummaryModalContentProps
> = ({ asset, blockExplorer, network }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  // misc
  const totalSupplyInStandardUnits = convertToStandardUnit(
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
          spacing={0}
          w="full"
        >
          {/*application id*/}
          <HStack spacing={1} w="full">
            <ModalTextItem
              flexGrow={1}
              isCode={true}
              label={`${t<string>('labels.applicationId')}:`}
              value={asset.id}
            />

            <CopyIconButton
              ariaLabel={t<string>('labels.copyApplicationId')}
              tooltipLabel={t<string>('labels.copyApplicationId')}
              value={asset.id}
            />

            {blockExplorer && (
              <OpenTabIconButton
                tooltipLabel={t<string>('captions.openOn', {
                  name: blockExplorer.canonicalName,
                })}
                url={blockExplorer.applicationURL(asset.id)}
              />
            )}
          </HStack>

          {/*name*/}
          <ModalTextItem
            label={`${t<string>('labels.name')}:`}
            tooltipLabel={asset.name}
            value={asset.name}
          />

          {/*type*/}
          <ModalItem
            label={`${t<string>('labels.type')}:`}
            value={<AssetBadge type={AssetTypeEnum.ARC0200} />}
          />

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="xs"
            isOpen={isOpen}
            minButtonHeight={MODAL_ITEM_HEIGHT}
            onChange={handleMoreInformationToggle}
          >
            <VStack spacing={0} w="full">
              {/*decimals*/}
              <ModalTextItem
                label={`${t<string>('labels.decimals')}:`}
                value={asset.decimals.toString()}
              />

              {/*total supply*/}
              <ModalTextItem
                label={`${t<string>('labels.totalSupply')}:`}
                tooltipLabel={formatCurrencyUnit(totalSupplyInStandardUnits, {
                  decimals: asset.decimals,
                  thousandSeparatedOnly: true,
                })}
                value={formatCurrencyUnit(
                  convertToStandardUnit(
                    new BigNumber(asset.totalSupply),
                    asset.decimals
                  ),
                  { decimals: asset.decimals }
                )}
              />
            </VStack>
          </MoreInformationAccordion>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default AddAssetsARC0200AssetSummaryModalContent;
