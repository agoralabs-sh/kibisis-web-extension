import { Button, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// components
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import NFTAvatar from '@extension/components/NFTAvatar';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT, NFTS_ROUTE } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { INFTsTabARC0072AssetItemProps } from './types';

const NFTsTabARC0072AssetItem: FC<INFTsTabARC0072AssetItemProps> = ({
  arc0072AssetHolding,
  network,
}) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // misc

  return (
    <Tooltip
      aria-label="ARC-0072 asset"
      label={arc0072AssetHolding.metadata.name || arc0072AssetHolding.tokenId}
    >
      <Button
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        as={Link}
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
        to={`${NFTS_ROUTE}/${arc0072AssetHolding.id}/${arc0072AssetHolding.tokenId}`}
        variant="ghost"
        w="full"
      >
        <HStack alignItems="center" m={0} p={0} spacing={2} w="full">
          {/*icon*/}
          <NFTAvatar
            assetHolding={arc0072AssetHolding}
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

          {/*name/application id*/}
          {arc0072AssetHolding.metadata.name ? (
            <VStack
              alignItems="flex-start"
              flexGrow={1}
              h="100%"
              justifyContent="space-between"
              spacing={DEFAULT_GAP / 3}
            >
              {/*name*/}
              <Text
                color={defaultTextColor}
                fontSize="sm"
                maxW={175}
                noOfLines={1}
              >
                {arc0072AssetHolding.metadata.name}
              </Text>

              {/*application id*/}
              <Text color={subTextColor} fontSize="xs">
                {arc0072AssetHolding.id}
              </Text>
            </VStack>
          ) : (
            // application id
            <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
              {arc0072AssetHolding.id}
            </Text>
          )}

          {/*token id/type*/}
          <VStack
            alignItems="flex-end"
            h="100%"
            justifyContent="space-between"
            spacing={DEFAULT_GAP / 3}
          >
            {/*token id*/}
            <Text color={defaultTextColor} fontSize="sm">
              {`#${arc0072AssetHolding.tokenId}`}
            </Text>

            {/*type*/}
            <AssetBadge type={AssetTypeEnum.ARC0072} />
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default NFTsTabARC0072AssetItem;
