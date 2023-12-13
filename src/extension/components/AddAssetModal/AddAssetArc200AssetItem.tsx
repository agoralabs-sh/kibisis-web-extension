import {
  Button,
  ColorMode,
  HStack,
  Icon,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectColorMode } from '@extension/selectors';

// types
import { IArc200Asset, INetwork } from '@extension/types';

interface IProps {
  asset: IArc200Asset;
  network: INetwork;
}

const AddAssetArc200AssetItem: FC<IProps> = ({ asset, network }: IProps) => {
  // selectors
  const colorMode: ColorMode = useSelectColorMode();
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();

  return (
    <Tooltip aria-label="ARC200 asset" label={asset.name}>
      <Button
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        borderRadius={0}
        fontSize="md"
        h={TAB_ITEM_HEIGHT}
        justifyContent="start"
        pl={3}
        pr={1}
        py={0}
        rightIcon={
          <Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />
        }
        variant="ghost"
        w="full"
      >
        <HStack
          alignItems="center"
          m={0}
          p={0}
          spacing={DEFAULT_GAP / 3}
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
            size="sm"
          />

          {/*name/symbol*/}
          <VStack
            alignItems="flex-start"
            flexGrow={1}
            h="100%"
            justifyContent="space-between"
            spacing={DEFAULT_GAP / 3}
          >
            <Text
              color={defaultTextColor}
              fontSize="sm"
              maxW={175}
              noOfLines={1}
            >
              {asset.name}
            </Text>

            <Text color={subTextColor} fontSize="xs">
              {asset.symbol}
            </Text>
          </VStack>

          {/*id/tag*/}
          <VStack
            alignItems="flex-end"
            h="100%"
            justifyContent="space-between"
            spacing={DEFAULT_GAP / 3}
          >
            <Text color={defaultTextColor} fontSize="xs">
              {asset.id}
            </Text>

            <Tag
              colorScheme="green"
              size="sm"
              variant={colorMode === 'dark' ? 'solid' : 'subtle'}
            >
              <TagLabel>ARC200</TagLabel>
            </Tag>
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default AddAssetArc200AssetItem;
