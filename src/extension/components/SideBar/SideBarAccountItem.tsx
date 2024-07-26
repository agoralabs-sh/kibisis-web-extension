import {
  Button,
  ButtonProps,
  Center,
  HStack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AccountAvatarWithBadges from '@extension/components/AccountAvatarWithBadges';

// constants
import {
  DEFAULT_GAP,
  SIDEBAR_ITEM_HEIGHT,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { ISideBarAccountItemProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const SideBarAccountItem: FC<ISideBarAccountItemProps> = ({
  account,
  accounts,
  active,
  network,
  onClick,
}) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  const activeBackground = useColorModeValue('gray.200', 'whiteAlpha.200');
  // misc
  const address = convertPublicKeyToAVMAddress(account.publicKey);
  const activeProps: Partial<ButtonProps> = active
    ? {
        _hover: {
          bg: activeBackground,
        },
        bg: activeBackground,
      }
    : {
        _hover: {
          bg: buttonHoverBackgroundColor,
        },
      };
  // handlers
  const handleOnClick = () => onClick(account.id);

  return (
    <Tooltip
      aria-label="Name or address of the account"
      label={account.name || address}
    >
      <Button
        {...activeProps}
        borderRadius={0}
        fontSize="md"
        justifyContent="start"
        minH={SIDEBAR_ITEM_HEIGHT}
        onClick={handleOnClick}
        p={0}
        variant="ghost"
        w="full"
      >
        {/*icon*/}
        <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
          <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
            <AccountAvatarWithBadges
              account={account}
              accounts={accounts}
              network={network}
            />
          </Center>

          {/*name/address*/}
          {account.name ? (
            <VStack
              alignItems="flex-start"
              flexGrow={1}
              justifyContent="space-evenly"
              spacing={0}
              w="full"
            >
              <Text
                color={defaultTextColor}
                fontSize="sm"
                maxW={195}
                noOfLines={1}
                textAlign="left"
              >
                {account.name}
              </Text>

              <Text color={subTextColor} fontSize="xs" textAlign="left">
                {ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </VStack>
          ) : (
            <Text
              color={defaultTextColor}
              flexGrow={1}
              fontSize="sm"
              textAlign="left"
            >
              {ellipseAddress(address, {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default SideBarAccountItem;
