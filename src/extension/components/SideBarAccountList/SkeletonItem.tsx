import {
  Button,
  Center,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { type FC } from 'react';

// constants
import { SIDEBAR_ITEM_HEIGHT, SIDEBAR_MIN_WIDTH } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const SkeletonItem: FC = () => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();

  return (
    <Button
      _hover={{
        bg: buttonHoverBackgroundColor,
      }}
      borderRadius={0}
      fontSize="md"
      h={SIDEBAR_ITEM_HEIGHT}
      justifyContent="start"
      p={0}
      variant="ghost"
      w="full"
    >
      <HStack m={0} p={0} spacing={0} w="full">
        <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
          <SkeletonCircle size="9" />
        </Center>

        <Skeleton>
          <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
            {ellipseAddress(generateAccount().addr, {
              end: 10,
              start: 10,
            })}
          </Text>
        </Skeleton>
      </HStack>
    </Button>
  );
};

export default SkeletonItem;
