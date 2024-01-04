import {
  Button,
  ColorMode,
  HStack,
  Icon,
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
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';

// constants
import {
  ACCOUNTS_ROUTE,
  ASSETS_ROUTE,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectColorMode } from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import { IAccount, IArc200Asset, INetwork } from '@extension/types';

// utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';

interface IProps {
  account: IAccount;
  amount: string;
  arc200Asset: IArc200Asset;
  network: INetwork;
}

const AssetTabArc200AssetItem: FC<IProps> = ({
  account,
  amount,
  arc200Asset,
  network,
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
    new BigNumber(amount),
    arc200Asset.decimals
  );

  return (
    <Tooltip
      aria-label="ARC200 asset"
      label={arc200Asset.name || arc200Asset.id}
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
        )}${ASSETS_ROUTE}/${arc200Asset.id}`}
        variant="ghost"
        w="full"
      >
        <HStack alignItems="center" m={0} p={0} spacing={2} w="full">
          {/*icon*/}
          <AssetAvatar
            asset={arc200Asset}
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
          {arc200Asset.symbol ? (
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
                {arc200Asset.name || arc200Asset.id}
              </Text>

              <Text color={subTextColor} fontSize="xs">
                {arc200Asset.symbol}
              </Text>
            </VStack>
          ) : (
            <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
              {arc200Asset.name || arc200Asset.id}
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
              {formatCurrencyUnit(standardUnitAmount, {
                decimals: arc200Asset.decimals,
              })}
            </Text>

            <AssetBadge type={AssetTypeEnum.Arc200} />
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default AssetTabArc200AssetItem;
