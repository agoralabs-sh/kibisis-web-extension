import { ColorMode, HStack, Tag, TagLabel } from '@chakra-ui/react';
import React, { FC } from 'react';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import { INetwork } from '@extension/types';

// utils
import { createIconFromDataUri } from '@extension/utils';

// selectors
import { useSelectColorMode } from '@extension/selectors';

interface IProps {
  network: INetwork;
  size?: string;
}

const ChainBadge: FC<IProps> = ({ network, size = 'sm' }: IProps) => {
  const colorMode: ColorMode = useSelectColorMode();
  const renderChainTag = () => (
    <Tag
      colorScheme={network.chakraTheme}
      size={size}
      variant={colorMode === 'dark' ? 'solid' : 'outline'}
    >
      {createIconFromDataUri(network.nativeCurrency.iconUrl, {
        color: network.chakraTheme,
        h: 3,
        mr: 2,
        w: 3,
      })}
      <TagLabel>{network.canonicalName}</TagLabel>
    </Tag>
  );

  switch (network.type) {
    case NetworkTypeEnum.Beta:
      return (
        <HStack alignItems="center" justifyContent="flex-start" spacing={1}>
          {renderChainTag()}
          <Tag
            colorScheme="blue"
            size={size}
            variant={colorMode === 'dark' ? 'solid' : 'subtle'}
          >
            <TagLabel>BetaNet</TagLabel>
          </Tag>
        </HStack>
      );
    case NetworkTypeEnum.Test:
      return (
        <HStack alignItems="center" justifyContent="flex-start" spacing={1}>
          {renderChainTag()}
          <Tag
            colorScheme="yellow"
            size={size}
            variant={colorMode === 'dark' ? 'solid' : 'subtle'}
          >
            <TagLabel>TestNet</TagLabel>
          </Tag>
        </HStack>
      );
    case NetworkTypeEnum.Stable:
    default:
      return renderChainTag();
  }
};

export default ChainBadge;
