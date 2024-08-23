import {
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useItemBorderColor from '@extension/hooks/useItemBorderColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const SettingsSessionItemSkeleton: FC = () => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const itemBorderColor = useItemBorderColor();
  const subTextColor: string = useSubTextColor();

  return (
    <HStack
      borderBottomColor={itemBorderColor}
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      m={0}
      p={DEFAULT_GAP - 2}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      <SkeletonCircle size="10" />

      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="space-evenly"
        spacing={DEFAULT_GAP / 3}
      >
        <Skeleton>
          <Text color={defaultTextColor} fontSize="md" textAlign="left">
            {faker.random.alpha({ count: 32 })}
          </Text>
        </Skeleton>

        <Skeleton>
          <Text color={subTextColor} fontSize="sm" textAlign="left">
            {faker.date.future().toLocaleString()}
          </Text>
        </Skeleton>
      </VStack>
    </HStack>
  );
};

export default SettingsSessionItemSkeleton;
