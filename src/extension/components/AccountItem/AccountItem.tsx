import { Center, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AccountAvatar from '@extension/components/AccountAvatar';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const AccountItem: FC<IProps> = ({ account, subTextColor, textColor }) => {
  // hooks
  const defaultSubTextColor = useSubTextColor();
  const defaultTextColor = useDefaultTextColor();
  // misc
  const address = convertPublicKeyToAVMAddress(
    PrivateKeyService.decode(account.publicKey)
  );

  return (
    <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
      {/*avatar*/}
      <Center>
        <AccountAvatar />
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
