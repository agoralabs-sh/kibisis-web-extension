import { HStack, Tag, TagLabel, type TagProps } from '@chakra-ui/react';
import React, { type FC } from 'react';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import type { IProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import mapIconSizeToSize from './utils/mapIconSizeToSize';

const NetworkBadge: FC<IProps> = ({ network, size = 'sm' }) => {
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
  const renderTypeTag = () => {
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
    const typeTag = renderTypeTag();

    if (typeTag) {
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
          {typeTag}
        </>
      );
    }

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
  };

  return (
    <HStack alignItems="center" justifyContent="flex-start" spacing={0}>
      {renderTags()}
    </HStack>
  );
};

export default NetworkBadge;
