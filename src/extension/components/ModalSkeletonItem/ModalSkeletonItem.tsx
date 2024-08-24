import { HStack, Skeleton, StackProps, Text } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const ModalSkeletonItem: FC<StackProps> = (props: StackProps) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={MODAL_ITEM_HEIGHT}
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...props}
    >
      <Skeleton>
        <Text color={defaultTextColor} fontSize="xs">{`${faker.random.alpha(
          6
        )}:`}</Text>
      </Skeleton>

      <Skeleton>
        <Text color={subTextColor} fontSize="xs">
          {faker.random.alpha(8)}
        </Text>
      </Skeleton>
    </HStack>
  );
};

export default ModalSkeletonItem;
