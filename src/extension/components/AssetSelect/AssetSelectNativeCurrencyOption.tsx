import { HStack, Text } from '@chakra-ui/react';
import React, { FC, ReactEventHandler, useState } from 'react';

// components
import AssetAvatar from '@extension/components/AssetAvatar';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';
import { OPTION_HEIGHT } from './constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';

// theme
import { theme } from '@extension/theme';

// types
import { INativeCurrency } from '@extension/types';
import { createIconFromDataUri } from '@extension/utils';

interface IProps {
  asset: INativeCurrency;
  isSelected: boolean;
  onClick?: ReactEventHandler<HTMLDivElement>;
}

const AssetSelectNativeCurrencyOption: FC<IProps> = ({
  asset,
  isSelected,
  onClick,
}: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  // state
  const [backgroundColor, setBackgroundColor] = useState<string>(
    isSelected ? primaryColor : BODY_BACKGROUND_COLOR
  );
  // misc
  const formattedDefaultTextColor: string = isSelected
    ? primaryButtonTextColor
    : defaultTextColor;
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
      <AssetAvatar asset={asset} size="xs" />

      {/*symbol*/}
      <Text color={formattedDefaultTextColor} flexGrow={1} fontSize="sm">
        {asset.symbol}
      </Text>
    </HStack>
  );
};

export default AssetSelectNativeCurrencyOption;
