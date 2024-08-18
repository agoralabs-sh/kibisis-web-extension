import { HStack, Tag, TagLabel, type TagProps } from '@chakra-ui/react';
import React, { type FC } from 'react';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import mapIconSizeToSize from './utils/mapIconSizeToSize';

const NetworkBadge: FC<IProps> = ({ customNode, network, size = 'sm' }) => {
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // misc
  const nativeCurrencyIcon = createIconFromDataUri(
    network.nativeCurrency.iconUrl,
    {
      color: network.chakraTheme,
      boxSize: mapIconSizeToSize(size),
      mr: 2,
    }
  );
  // renders
  const renderNetworkTypeTag = () => {
    const defaultProps: Partial<TagProps> = {
      size,
      variant: 'solid',
      borderRightRadius: 'full',
    };

    switch (network.type) {
      case NetworkTypeEnum.Beta:
        return (
          <Tag {...defaultProps} colorScheme="blue">
            <TagLabel>BetaNet</TagLabel>
          </Tag>
        );
      case NetworkTypeEnum.Test:
        return (
          <Tag {...defaultProps} colorScheme="yellow">
            <TagLabel>TestNet</TagLabel>
          </Tag>
        );
      default:
        return null;
    }
  };
  const renderTags = () => {
    if (customNode) {
      return (
        <>
          {/*custom node name*/}
          <Tag
            borderLeftRadius="full"
            colorScheme="green"
            size={size}
            variant="solid"
          >
            <TagLabel>{customNode.name}</TagLabel>
          </Tag>

          {/*network name*/}
          <Tag
            colorScheme={network.chakraTheme}
            size={size}
            variant="solid"
            {...(network.type === NetworkTypeEnum.Stable
              ? {
                  // mainnet will not have a network type tag
                  borderRightRadius: 'full',
                }
              : {
                  borderRadius: 'none',
                })}
          >
            {nativeCurrencyIcon}

            <TagLabel>{network.canonicalName}</TagLabel>
          </Tag>

          {/*network type*/}
          {renderNetworkTypeTag()}
        </>
      );
    }

    if (network.type === NetworkTypeEnum.Stable) {
      return (
        <Tag
          borderRadius="full"
          colorScheme={network.chakraTheme}
          size={size}
          variant="solid"
        >
          {nativeCurrencyIcon}

          <TagLabel>{network.canonicalName}</TagLabel>
        </Tag>
      );
    }

    return (
      <>
        {/*network name*/}
        <Tag
          borderLeftRadius="full"
          colorScheme={network.chakraTheme}
          size={size}
          variant="solid"
        >
          {nativeCurrencyIcon}

          <TagLabel>{network.canonicalName}</TagLabel>
        </Tag>

        {/*network type*/}
        {renderNetworkTypeTag()}
      </>
    );
  };

  return (
    <HStack alignItems="center" justifyContent="flex-start" spacing={0}>
      {renderTags()}
    </HStack>
  );
};

export default NetworkBadge;
