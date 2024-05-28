import { HStack, Tag, TagLabel } from '@chakra-ui/react';
import React, { FC } from 'react';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import mapIconSizeToSize from './utils/mapIconSizeToSize';

const ChainBadge: FC<IProps> = ({ network, size = 'sm' }) => {
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // misc
  const nativeCurrencyIcon = createIconFromDataUri(
    network.nativeCurrency.iconUrl,
    {
      color: network.chakraTheme,
      h: mapIconSizeToSize(size),
      mr: 2,
      w: mapIconSizeToSize(size),
    }
  );

  switch (network.type) {
    case NetworkTypeEnum.Beta:
      return (
        <HStack alignItems="center" justifyContent="flex-start" spacing={0}>
          <Tag
            borderLeftRadius="full"
            colorScheme={network.chakraTheme}
            size={size}
            variant={colorMode === 'dark' ? 'solid' : 'outline'}
          >
            {nativeCurrencyIcon}

            <TagLabel>{network.canonicalName}</TagLabel>
          </Tag>

          <Tag
            borderRightRadius="full"
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
        <HStack alignItems="center" justifyContent="flex-start" spacing={0}>
          <Tag
            borderLeftRadius="full"
            colorScheme={network.chakraTheme}
            size={size}
            variant={colorMode === 'dark' ? 'solid' : 'outline'}
          >
            {nativeCurrencyIcon}

            <TagLabel>{network.canonicalName}</TagLabel>
          </Tag>

          <Tag
            borderRightRadius="full"
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
      return (
        <Tag
          borderRadius="full"
          colorScheme={network.chakraTheme}
          size={size}
          variant={colorMode === 'dark' ? 'solid' : 'outline'}
        >
          {nativeCurrencyIcon}

          <TagLabel>{network.canonicalName}</TagLabel>
        </Tag>
      );
  }
};

export default ChainBadge;
