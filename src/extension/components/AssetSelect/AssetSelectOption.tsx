import { HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC, ReactEventHandler, SyntheticEvent, useState } from 'react';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';
import { OPTION_HEIGHT } from './constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

// types
import { IAsset, INetworkWithTransactionParams } from '@extension/types';

interface IProps {
  asset: IAsset;
  isSelected: boolean;
  onClick?: ReactEventHandler<HTMLDivElement>;
  network: INetworkWithTransactionParams;
}

const AssetSelectOption: FC<IProps> = ({
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
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const subTextColor: string = useSubTextColor();
  // state
  const [backgroundColor, setBackgroundColor] = useState<string>(
    isSelected ? primaryColor : 'var(--chakra-colors-chakra-body-bg)'
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
      setBackgroundColor('var(--chakra-colors-chakra-body-bg)');
    }
  };
  // renders
  const renderUnitName = () => {
    if (asset.id === '0') {
      return (
        <Text color={formattedDefaultTextColor} flexGrow={1} fontSize="sm">
          {asset.unitName}
        </Text>
      );
    }

    if (!asset.unitName) {
      if (asset.name) {
        return (
          <VStack
            alignItems="flex-start"
            flexGrow={1}
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
              {asset.id}
            </Text>
          </VStack>
        );
      }

      return (
        <Text color={formattedDefaultTextColor} flexGrow={1} fontSize="sm">
          {asset.id}
        </Text>
      );
    }

    return (
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="space-between"
        spacing={0}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
          spacing={DEFAULT_GAP / 2}
          w="full"
        >
          <Text color={formattedDefaultTextColor} fontSize="sm">
            {asset.unitName}
          </Text>

          <Text color={formattedSubTextColor} fontSize="xs">
            {asset.id}
          </Text>
        </HStack>

        {asset.name && (
          <Text
            color={formattedSubTextColor}
            fontSize="xs"
            maxW={175}
            noOfLines={1}
          >
            {asset.name}
          </Text>
        )}
      </VStack>
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
      spacing={2}
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

      {/*name/unit*/}
      {renderUnitName()}
    </HStack>
  );
};

export default AssetSelectOption;
