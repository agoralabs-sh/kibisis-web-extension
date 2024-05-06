import {
  Button,
  HStack,
  Icon,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkCircleOutline, IoChevronForward } from 'react-icons/io5';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectColorMode } from '@extension/selectors';

// types
import type { IStandardAsset } from '@extension/types';
import type { IItemProps } from './types';

const AddAssetsStandardAssetItem: FC<IItemProps<IStandardAsset>> = ({
  added,
  asset,
  network,
  onClick,
}) => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectColorMode();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // handlers
  const handleOnClick = () => {
    // if it is already added, just ignore
    if (added) {
      return;
    }

    onClick(asset);
  };
  // renders
  const renderAssetBadge = () => {
    const assetBadge = <AssetBadge type={AssetTypeEnum.Standard} />;

    if (!added) {
      return assetBadge;
    }

    return (
      <HStack spacing={1}>
        <Tag
          colorScheme="green"
          size="sm"
          variant={colorMode === 'dark' ? 'solid' : 'subtle'}
        >
          <TagLabel>{t('labels.alreadyAdded')}</TagLabel>
        </Tag>

        {assetBadge}
      </HStack>
    );
  };
  const renderContent = () => {
    if (asset.name && asset.unitName) {
      return (
        <VStack
          alignItems="flex-start"
          flexGrow={1}
          h="100%"
          justifyContent="space-between"
          w="full"
        >
          {/*name/id*/}
          <HStack
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            w="full"
          >
            <Text
              color={defaultTextColor}
              fontSize="sm"
              maxW={175}
              noOfLines={1}
            >
              {asset.name}
            </Text>

            <Text color={subTextColor} fontSize="xs">
              {asset.id}
            </Text>
          </HStack>

          {/*unit/type*/}
          <HStack
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            w="full"
          >
            <Text color={subTextColor} fontSize="xs">
              {asset.unitName}
            </Text>

            {renderAssetBadge()}
          </HStack>
        </VStack>
      );
    }

    if (!asset.name && asset.unitName) {
      return (
        <>
          {/*unit*/}
          <VStack
            alignItems="flex-start"
            flexGrow={1}
            h="100%"
            justifyContent="center"
            spacing={DEFAULT_GAP / 3}
          >
            <Text
              color={defaultTextColor}
              fontSize="sm"
              maxW={175}
              noOfLines={1}
            >
              {asset.unitName}
            </Text>
          </VStack>

          {/*id/type*/}
          <VStack
            alignItems="flex-end"
            h="100%"
            justifyContent="space-between"
            spacing={DEFAULT_GAP / 3}
          >
            <Text color={subTextColor} fontSize="xs">
              {asset.id}
            </Text>

            {renderAssetBadge()}
          </VStack>
        </>
      );
    }

    if (asset.name && !asset.unitName) {
      return (
        <>
          {/*name*/}
          <VStack
            alignItems="flex-start"
            flexGrow={1}
            h="100%"
            justifyContent="center"
            spacing={DEFAULT_GAP / 3}
          >
            <Text
              color={defaultTextColor}
              fontSize="sm"
              maxW={175}
              noOfLines={1}
            >
              {asset.name}
            </Text>
          </VStack>

          {/*id/type*/}
          <VStack
            alignItems="flex-end"
            h="100%"
            justifyContent="space-between"
            spacing={DEFAULT_GAP / 3}
          >
            <Text color={subTextColor} fontSize="xs">
              {asset.id}
            </Text>

            {renderAssetBadge()}
          </VStack>
        </>
      );
    }

    return (
      <VStack
        alignItems="flex-end"
        flexGrow={1}
        h="100%"
        justifyContent="space-between"
        spacing={DEFAULT_GAP / 3}
      >
        <Text color={subTextColor} fontSize="xs">
          {asset.id}
        </Text>

        {renderAssetBadge()}
      </VStack>
    );
  };

  return (
    <Button
      _hover={{
        bg: !added ? buttonHoverBackgroundColor : BODY_BACKGROUND_COLOR,
      }}
      borderRadius={0}
      cursor={!added ? 'pointer' : 'not-allowed'}
      fontSize="md"
      h={TAB_ITEM_HEIGHT}
      justifyContent="start"
      onClick={handleOnClick}
      px={DEFAULT_GAP / 2}
      py={DEFAULT_GAP / 2}
      rightIcon={
        !added ? (
          <Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />
        ) : (
          <Icon as={IoCheckmarkCircleOutline} color="green.500" h={6} w={6} />
        )
      }
      variant="ghost"
      w="full"
    >
      <HStack
        alignItems="center"
        m={0}
        p={0}
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        {/*icon*/}
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
          size="sm"
        />

        {renderContent()}
      </HStack>
    </Button>
  );
};

export default AddAssetsStandardAssetItem;
