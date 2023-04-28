import { Avatar, Center, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// Hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { IAccount, IAccountInformation } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';
import { AccountService } from '@extension/services';

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
  const accountInformation: IAccountInformation | null = useAccountInformation(
    account.id
  );
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
      {accountInformation?.name ? (
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
            {accountInformation.name}
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
