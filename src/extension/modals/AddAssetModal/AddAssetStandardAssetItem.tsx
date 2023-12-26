import {
  Button,
  ColorMode,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import { INetwork, IStandardAsset } from '@extension/types';

interface IProps {
  asset: IStandardAsset;
  network: INetwork;
  onClick: (asset: IStandardAsset) => void;
}

const AddAssetStandardAssetItem: FC<IProps> = ({
  asset,
  network,
  onClick,
}: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleOnClick = () => onClick(asset);
  // renders
  const renderContent = () => {
    if (asset.name && asset.unitName) {
      return (
        <>
          {/*name/unit*/}
          <VStack
            alignItems="flex-start"
            flexGrow={1}
            h="100%"
            justifyContent="space-between"
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

            <Text color={subTextColor} fontSize="xs">
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

            <AssetBadge type={AssetTypeEnum.Standard} />
          </VStack>
        </>
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

            <AssetBadge type={AssetTypeEnum.Standard} />
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

            <AssetBadge type={AssetTypeEnum.Standard} />
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

        <AssetBadge type={AssetTypeEnum.Standard} />
      </VStack>
    );
  };

  return (
    <Button
      _hover={{
        bg: buttonHoverBackgroundColor,
      }}
      borderRadius={0}
      fontSize="md"
      h={TAB_ITEM_HEIGHT}
      justifyContent="start"
      onClick={handleOnClick}
      px={DEFAULT_GAP / 2}
      py={DEFAULT_GAP / 2}
      rightIcon={
        <Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />
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

export default AddAssetStandardAssetItem;
