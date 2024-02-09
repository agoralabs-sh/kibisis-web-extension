import { HStack, Spacer, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';
import { OPTION_HEIGHT } from './constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';

// types
import { IARC0200Asset, INetworkWithTransactionParams } from '@extension/types';

interface IProps {
  asset: IARC0200Asset;
  network: INetworkWithTransactionParams;
}

const AssetSelectARC0200AssetSingleValue: FC<IProps> = ({
  asset,
  network,
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();

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

      {/*symbol*/}
      <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
        {asset.symbol}
      </Text>

      <Spacer />

      {/*type*/}
      <AssetBadge type={asset.type} />
    </HStack>
  );
};

export default AssetSelectARC0200AssetSingleValue;
