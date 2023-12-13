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
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import {
  ACCOUNTS_ROUTE,
  ASSETS_ROUTE,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectColorMode } from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// types
import {
  IAccount,
  INetwork,
  IStandardAsset,
  IStandardAssetHolding,
} from '@extension/types';

// utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';

interface IProps {
  account: IAccount;
  network: INetwork;
  standardAsset: IStandardAsset;
  standardAssetHolding: IStandardAssetHolding;
}

const AssetTabStandardAssetItem: FC<IProps> = ({
  account,
  network,
  standardAsset,
  standardAssetHolding,
}: IProps) => {
  // selectors
  const colorMode: ColorMode = useSelectColorMode();
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const standardUnitAmount: BigNumber = convertToStandardUnit(
    new BigNumber(standardAssetHolding.amount),
    standardAsset.decimals
  );

  return (
    <Tooltip
      aria-label="Standard asset"
      label={standardAsset.name || standardAsset.id}
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
        to={`${ACCOUNTS_ROUTE}/${AccountService.convertPublicKeyToAlgorandAddress(
          account.publicKey
        )}${ASSETS_ROUTE}/${standardAsset.id}`}
        variant="ghost"
        w="full"
      >
        <HStack alignItems="center" m={0} p={0} spacing={2} w="full">
          {/*icon*/}
          <AssetAvatar
            asset={standardAsset}
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

          {/*name/unit*/}
          {standardAsset.unitName ? (
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
                {standardAsset.name || standardAsset.id}
              </Text>

              <Text color={subTextColor} fontSize="xs">
                {standardAsset.unitName}
              </Text>
            </VStack>
          ) : (
            <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
              {standardAsset.name || standardAsset.id}
            </Text>
          )}

          {/*amount*/}
          <VStack
            alignItems="flex-end"
            h="100%"
            justifyContent="space-between"
            spacing={DEFAULT_GAP / 3}
          >
            <Text color={defaultTextColor} fontSize="sm">
              {formatCurrencyUnit(standardUnitAmount, standardAsset.decimals)}
            </Text>

            <Tag
              colorScheme="blue"
              size="sm"
              variant={colorMode === 'dark' ? 'solid' : 'subtle'}
            >
              <TagLabel>ASA</TagLabel>
            </Tag>
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default AssetTabStandardAssetItem;
