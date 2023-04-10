import {
  Avatar,
  Button,
  Center,
  HStack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// Constants
import { SIDEBAR_ITEM_HEIGHT, SIDEBAR_MIN_WIDTH } from '@extension/constants';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { IAccount } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

interface IProps {
  account: IAccount;
  onClick: (address: string) => void;
}

const SideBarAccountItem: FC<IProps> = ({ account, onClick }: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleOnClick = () => onClick(account.address);

  return (
    <Tooltip
      aria-label="Name or address of the account"
      label={account.name || account.address}
    >
      <Button
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
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
            <Avatar bg="primary.500" icon={<IoWalletOutline />} size="sm" />
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
              >
                {account.name}
              </Text>
              <Text color={subTextColor} fontSize="xs">
                {ellipseAddress(account.address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </VStack>
          ) : (
            <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
              {ellipseAddress(account.address, {
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
