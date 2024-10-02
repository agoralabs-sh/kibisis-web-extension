import { Avatar, Center, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const NewAccountItem: FC<IProps> = ({
  address,
  name,
  subTextColor,
  textColor,
}) => {
  // hooks
  const defaultSubTextColor = useSubTextColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();

  return (
    <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
      {/*avatar*/}
      <Center>
        <Avatar
          bg={primaryColor}
          icon={<Icon as={IoWalletOutline} color={primaryButtonTextColor} />}
          size="sm"
        />
      </Center>

      {name ? (
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
            {name}
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

export default NewAccountItem;
