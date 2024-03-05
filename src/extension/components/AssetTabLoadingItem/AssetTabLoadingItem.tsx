import {
  Button,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const AssetTabLoadingItem: FC = () => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Button
      borderRadius={0}
      fontSize="md"
      h={TAB_ITEM_HEIGHT}
      justifyContent="start"
      pl={DEFAULT_GAP / 2}
      pr={1}
      py={0}
      variant="ghost"
      w="full"
    >
      <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
        <SkeletonCircle size="9" />

        <Skeleton flexGrow={1}>
          <Text color={defaultTextColor} fontSize="sm">
            {faker.company.bsBuzz()}
          </Text>
        </Skeleton>

        <Skeleton>
          <Text color={defaultTextColor} fontSize="sm">
            {faker.random.numeric(3)}
          </Text>
        </Skeleton>
      </HStack>
    </Button>
  );
};

export default AssetTabLoadingItem;
