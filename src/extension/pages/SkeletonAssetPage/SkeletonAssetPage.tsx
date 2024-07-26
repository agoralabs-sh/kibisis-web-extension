import {
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// components
import PageHeader from '@extension/components/PageHeader';

// constants
import { DEFAULT_GAP, PAGE_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const SkeletonAssetPage: FC = () => {
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <>
      <PageHeader loading={true} title={faker.random.alpha(12)} />

      <VStack
        alignItems="center"
        justifyContent="flex-start"
        p={DEFAULT_GAP - 2}
        spacing={DEFAULT_GAP}
        w="full"
      >
        <SkeletonCircle size="24" />

        {Array.from({ length: 3 }, () => (
          <HStack
            alignItems="center"
            h={PAGE_ITEM_HEIGHT}
            justifyContent="space-between"
            spacing={1}
            w="full"
          >
            <Skeleton>
              <Text color={defaultTextColor} fontSize="sm">
                {faker.random.alpha(12)}
              </Text>
            </Skeleton>

            <Skeleton>
              <Text color={defaultTextColor} fontSize="sm">
                {faker.random.alpha(32)}
              </Text>
            </Skeleton>
          </HStack>
        ))}
      </VStack>
    </>
  );
};

export default SkeletonAssetPage;
