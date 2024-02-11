import { ColorMode, HStack, Tag, TagLabel } from '@chakra-ui/react';
import React, { FC } from 'react';

// enums
import { AssetTypeEnum } from '@extension/enums';

// selectors
import { useSelectColorMode } from '@extension/selectors';

interface IProps {
  size?: string;
  type: AssetTypeEnum;
}

const AssetBadge: FC<IProps> = ({ size = 'sm', type }: IProps) => {
  // hooks
  const colorMode: ColorMode = useSelectColorMode();

  switch (type) {
    case AssetTypeEnum.ARC0200:
      return (
        <Tag
          colorScheme="green"
          size={size}
          variant={colorMode === 'dark' ? 'solid' : 'subtle'}
        >
          <TagLabel>ARC200</TagLabel>
        </Tag>
      );
    case AssetTypeEnum.Native:
      return (
        <Tag
          colorScheme="primary"
          size={size}
          variant={colorMode === 'dark' ? 'solid' : 'subtle'}
        >
          <TagLabel>Native</TagLabel>
        </Tag>
      );
    case AssetTypeEnum.Standard:
    default:
      return (
        <Tag
          colorScheme="blue"
          size={size}
          variant={colorMode === 'dark' ? 'solid' : 'subtle'}
        >
          <TagLabel>ASA</TagLabel>
        </Tag>
      );
  }
};

export default AssetBadge;
