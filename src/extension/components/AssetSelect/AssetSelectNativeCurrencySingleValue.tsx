import { HStack, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AssetAvatar from '@extension/components/AssetAvatar';

// constants
import { DEFAULT_GAP, OPTION_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import { INativeCurrency } from '@extension/types';

interface IProps {
  asset: INativeCurrency;
}

const AssetSelectNativeCurrencySingleValue: FC<IProps> = ({
  asset,
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      h={OPTION_HEIGHT}
      m={0}
      p={DEFAULT_GAP / 2}
      position="absolute"
      spacing={2}
      w="full"
    >
      {/*icon*/}
      <AssetAvatar asset={asset} size="xs" />

      {/*symbol*/}
      <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
        {asset.symbol}
      </Text>
    </HStack>
  );
};

export default AssetSelectNativeCurrencySingleValue;
