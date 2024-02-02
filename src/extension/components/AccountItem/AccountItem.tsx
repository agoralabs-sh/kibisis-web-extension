import { Avatar, Center, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import { IAccount } from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

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
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColor: string = usePrimaryColor();
  const address: string = AccountService.convertPublicKeyToAlgorandAddress(
    account.publicKey
  );

  return (
    <HStack m={0} p={0} spacing={2} w="full">
      <Center>
        <Avatar
          bg={primaryColor}
          icon={<Icon as={IoWalletOutline} color={primaryButtonTextColor} />}
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
            {ellipseAddress(address, {
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
          {ellipseAddress(address, {
            end: 10,
            start: 10,
          })}
        </Text>
      )}
    </HStack>
  );
};

export default AccountItem;
