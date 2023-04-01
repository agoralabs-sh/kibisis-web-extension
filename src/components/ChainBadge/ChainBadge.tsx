import { ColorMode, HStack, Tag, TagLabel } from '@chakra-ui/react';
import React, { FC } from 'react';

// Enums
import { NetworkTypeEnum } from '../../enums';

// Types
import { INetwork } from '../../types';

// Utils
import { createIconFromDataUri } from '../../utils';

// Selectors
import { useSelectColorMode } from '../../selectors';

interface IProps {
  network: INetwork;
}

const ChainBadge: FC<IProps> = ({ network }: IProps) => {
  const colorMode: ColorMode = useSelectColorMode();
  const renderChainTag = () => (
    <Tag
      colorScheme={network.chakraTheme}
      size="sm"
      variant={colorMode === 'dark' ? 'solid' : 'outline'}
    >
      {createIconFromDataUri(network.nativeCurrency.iconUri, {
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
            size="sm"
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
            size="sm"
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
