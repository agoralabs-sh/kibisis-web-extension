import { Button, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import { IArc200Asset, INetwork } from '@extension/types';

interface IProps {
  asset: IArc200Asset;
  network: INetwork;
  onClick: (asset: IArc200Asset) => void;
}

const AddAssetArc200AssetItem: FC<IProps> = ({
  asset,
  network,
  onClick,
}: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleOnClick = () => onClick(asset);

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
        onClick={handleOnClick}
        pl={DEFAULT_GAP / 2}
        pr={1}
        py={DEFAULT_GAP / 2}
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
            <Text color={subTextColor} fontSize="xs">
              {asset.id}
            </Text>

            <AssetBadge type={AssetTypeEnum.Arc200} />
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default AddAssetArc200AssetItem;
