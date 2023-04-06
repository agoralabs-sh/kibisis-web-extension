import { Avatar, Center, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

// Types
import { IAccount } from '../../types';

// Utils
import { ellipseAddress } from '../../utils';

interface IProps {
  account: IAccount;
  subTextColor?: string;
  textColor?: string;
}

const AccountItem: FC<IProps> = ({
  account,
  subTextColor,
  textColor,
}: IProps) => {
  const defaultSubTextColor: string = useSubTextColor();
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack m={0} p={0} spacing={2} w="full">
      <Center>
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
            color={textColor || defaultTextColor}
            fontSize="sm"
            maxW={195}
            noOfLines={1}
            textAlign="left"
          >
            {account.name}
          </Text>
          <Text
            color={subTextColor || defaultSubTextColor}
            fontSize="xs"
            textAlign="left"
          >
            {ellipseAddress(account.address, {
              end: 10,
              start: 10,
            })}
          </Text>
        </VStack>
      ) : (
        <Text
          color={textColor || defaultTextColor}
          flexGrow={1}
          fontSize="sm"
          textAlign="left"
        >
          {ellipseAddress(account.address, {
            end: 10,
            start: 10,
          })}
        </Text>
      )}
    </HStack>
  );
};

export default AccountItem;
