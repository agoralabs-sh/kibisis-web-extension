import { HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { FC, ReactEventHandler, ReactNode, useState } from 'react';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  OPTION_HEIGHT,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

// types
import {
  IStandardAsset,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  asset: IStandardAsset;
  isSelected: boolean;
  onClick?: ReactEventHandler<HTMLDivElement>;
  network: INetworkWithTransactionParams;
}

const AssetSelectStandardAssetOption: FC<IProps> = ({
  asset,
  isSelected,
  onClick,
  network,
}: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['100'],
    theme.colors.primaryDark['100']
  );
  const subTextColor: string = useSubTextColor();
  // state
  const [backgroundColor, setBackgroundColor] = useState<string>(
    isSelected ? primaryColor : BODY_BACKGROUND_COLOR
  );
  // misc
  const formattedDefaultTextColor: string = isSelected
    ? primaryButtonTextColor
    : defaultTextColor;
  const formattedSubTextColor: string = isSelected
    ? primaryButtonTextColor
    : subTextColor;
  // handlers
  const handleMouseEnter = () => {
    if (!isSelected) {
      setBackgroundColor(buttonHoverBackgroundColor);
    }
  };
  const handleMouseLeave = () => {
    if (!isSelected) {
      setBackgroundColor(BODY_BACKGROUND_COLOR);
    }
  };
  // renders
  const renderContent = () => {
    const idAndTypeNode: ReactNode = (
      <VStack alignItems="flex-end" justifyContent="space-between" spacing={0}>
        <AssetBadge type={asset.type} />

        <Text
          color={formattedSubTextColor}
          fontSize="xs"
          maxW={175}
          noOfLines={1}
        >
          {asset.id}
        </Text>
      </VStack>
    );

    if (!asset.unitName) {
      if (asset.name) {
        return (
          <>
            {/*name*/}
            <Text
              color={formattedDefaultTextColor}
              fontSize="sm"
              maxW={175}
              noOfLines={1}
            >
              {asset.name}
            </Text>

            <Spacer />

            {/*id/type*/}
            {idAndTypeNode}
          </>
        );
      }

      return (
        <>
          {/*id*/}
          <Text color={formattedDefaultTextColor} fontSize="sm">
            {asset.id}
          </Text>

          <Spacer />

          {/*type*/}
          <AssetBadge type={asset.type} />
        </>
      );
    }

    // if there is a unit, but no name
    if (!asset.name) {
      return (
        <>
          {/*unit*/}
          <Text
            color={formattedDefaultTextColor}
            fontSize="sm"
            maxW={175}
            noOfLines={1}
          >
            {asset.unitName}
          </Text>

          <Spacer />

          {/*id/type*/}
          {idAndTypeNode}
        </>
      );
    }

    // if there is a unit and name
    return (
      <>
        {/*name/unit*/}
        <VStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={0}
        >
          <Text
            color={formattedDefaultTextColor}
            fontSize="sm"
            maxW={175}
            noOfLines={1}
          >
            {asset.name}
          </Text>

          <Text color={formattedSubTextColor} fontSize="xs">
            {asset.unitName}
          </Text>
        </VStack>

        <Spacer />

        {/*id/type*/}
        {idAndTypeNode}
      </>
    );
  };

  return (
    <HStack
      alignItems="center"
      backgroundColor={backgroundColor}
      cursor="pointer"
      h={OPTION_HEIGHT}
      m={0}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      p={DEFAULT_GAP / 2}
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
        size="xs"
      />

      {renderContent()}
    </HStack>
  );
};

export default AssetSelectStandardAssetOption;
