import { HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IStandardAsset } from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const AssetItem: FC<IProps> = ({ asset, network }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('md');
  // renders
  const renderStandardAsset = (_asset: IStandardAsset) => {
    if (_asset.unitName) {
      if (_asset.name) {
        return (
          <>
            <VStack
              alignItems="flex-start"
              flexGrow={1}
              h="100%"
              justifyContent="space-evenly"
              spacing={0}
            >
              {/*name*/}
              <Text
                color={defaultTextColor}
                fontSize="sm"
                maxW={195}
                noOfLines={1}
                textAlign="left"
                w="full"
              >
                {_asset.name}
              </Text>

              {/*unit name*/}
              <Text
                color={subTextColor}
                fontSize="xs"
                textAlign="left"
                w="full"
              >
                {_asset.unitName}
              </Text>
            </VStack>

            <VStack
              alignItems="flex-end"
              h="100%"
              justifyContent="space-evenly"
              spacing={0}
            >
              {/*id*/}
              <Text
                color={subTextColor}
                fontSize="xs"
                textAlign="right"
                w="full"
              >
                {_asset.id}
              </Text>

              {/*type*/}
              <AssetBadge type={asset.type} />
            </VStack>
          </>
        );
      }

      return (
        <>
          <VStack
            alignItems="flex-start"
            flexGrow={1}
            h="100%"
            justifyContent="space-evenly"
            spacing={0}
          >
            {/*unit name*/}
            <Text
              color={defaultTextColor}
              fontSize="sm"
              maxW={195}
              noOfLines={1}
              textAlign="left"
              w="full"
            >
              {_asset.unitName}
            </Text>

            {/*id*/}
            <Text color={subTextColor} fontSize="xs" textAlign="left" w="full">
              {_asset.id}
            </Text>
          </VStack>

          {/*type*/}
          <AssetBadge type={asset.type} />
        </>
      );
    }

    if (_asset.name) {
      return (
        <>
          <VStack
            alignItems="flex-start"
            flexGrow={1}
            h="100%"
            justifyContent="space-evenly"
            spacing={0}
          >
            {/*name*/}
            <Text
              color={defaultTextColor}
              fontSize="sm"
              maxW={195}
              noOfLines={1}
              textAlign="left"
              w="full"
            >
              {_asset.name}
            </Text>

            {/*id*/}
            <Text color={subTextColor} fontSize="xs" textAlign="left" w="full">
              {_asset.id}
            </Text>
          </VStack>

          {/*type*/}
          <AssetBadge type={asset.type} />
        </>
      );
    }

    return (
      <>
        {/*id*/}
        <Text
          color={defaultTextColor}
          flexGrow={1}
          fontSize="sm"
          textAlign="left"
          w="full"
        >
          {_asset.name}
        </Text>

        {/*type*/}
        <AssetBadge type={asset.type} />
      </>
    );
  };
  const renderContent = () => {
    switch (asset.type) {
      case AssetTypeEnum.ARC0200:
        return (
          <>
            {asset.name ? (
              <VStack
                alignItems="flex-start"
                flexGrow={1}
                h="100%"
                justifyContent="space-evenly"
                spacing={0}
              >
                {/*name*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  maxW={195}
                  noOfLines={1}
                  textAlign="left"
                  w="full"
                >
                  {asset.name}
                </Text>

                {/*symbol*/}
                <Text
                  color={subTextColor}
                  fontSize="xs"
                  textAlign="left"
                  w="full"
                >
                  {asset.symbol}
                </Text>
              </VStack>
            ) : (
              // symbol
              <Text
                color={defaultTextColor}
                fontSize="sm"
                flexGrow={1}
                textAlign="left"
                w="full"
              >
                {asset.symbol}
              </Text>
            )}

            <VStack
              alignItems="flex-end"
              h="100%"
              justifyContent="space-evenly"
              spacing={0}
            >
              {/*id*/}
              <Text
                color={subTextColor}
                fontSize="xs"
                textAlign="right"
                w="full"
              >
                {asset.id}
              </Text>

              {/*type*/}
              <AssetBadge type={asset.type} />
            </VStack>
          </>
        );
      case AssetTypeEnum.Native:
        return (
          <Text
            color={defaultTextColor}
            fontSize="sm"
            flexGrow={1}
            textAlign="left"
          >
            {asset.symbol}
          </Text>
        );
      case AssetTypeEnum.Standard:
        return renderStandardAsset(asset);
    }
  };

  return (
    <HStack alignItems="center" m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
      {/*icon*/}
      <AssetAvatar
        asset={asset}
        fallbackIcon={
          <AssetIcon
            color={primaryButtonTextColor}
            networkTheme={network.chakraTheme}
            h={iconSize}
            w={iconSize}
          />
        }
        size="sm"
      />

      {renderContent()}
    </HStack>
  );
};

export default AssetItem;
