import {
  Avatar,
  Button,
  ButtonProps,
  Center,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// constants
import { SIDEBAR_ITEM_HEIGHT, SIDEBAR_MIN_WIDTH } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import { AccountService } from '@extension/services';

// types
import { IAccount } from '@extension/types';

// utils
import { ellipseAddress } from '@extension/utils';

interface IProps {
  account: IAccount;
  active: boolean;
  onClick: (address: string) => void;
}

const SideBarAccountItem: FC<IProps> = ({
  account,
  active,
  onClick,
}: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColor: string = usePrimaryColor();
  const subTextColor: string = useSubTextColor();
  const activeBackground: string = useColorModeValue(
    'gray.200',
    'whiteAlpha.200'
  );
  const address: string = AccountService.convertPublicKeyToAlgorandAddress(
    account.publicKey
  );
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
  const handleOnClick = () => onClick(address);

  return (
    <Tooltip
      aria-label="Name or address of the account"
      label={account.name || address}
    >
      <Button
        {...activeProps}
        borderRadius={0}
        fontSize="md"
        h={SIDEBAR_ITEM_HEIGHT}
        justifyContent="start"
        onClick={handleOnClick}
        p={0}
        variant="ghost"
        w="full"
      >
        <HStack m={0} p={0} spacing={0} w="full">
          <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
            <Avatar
              bg={primaryColor}
              icon={
                <Icon as={IoWalletOutline} color={primaryButtonTextColor} />
              }
              size="sm"
            />
          </Center>

          {account.name ? (
            <VStack
              alignItems="flex-start"
              flexGrow={1}
              justifyContent="space-evenly"
              spacing={0}
            >
              <Text
                color={defaultTextColor}
                fontSize="sm"
                maxW={195}
                noOfLines={1}
                textAlign="left"
                w="full"
              >
                {account.name}
              </Text>

              <Text
                color={subTextColor}
                fontSize="xs"
                textAlign="left"
                w="full"
              >
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
              w="full"
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
